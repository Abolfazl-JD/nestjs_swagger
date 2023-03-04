import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { sign, verify } from "jsonwebtoken";
import { LoginUserDto } from "./dto/login-user.dto";
import { RegisterUserDto } from "./dto/register-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "./user.entity";
import { UsersService } from "./users.service";

@Injectable()
export class AuthService {
    
    constructor(
        private readonly usersService: UsersService,
        private configService: ConfigService
    ){}

    async signupUser(userInfo: RegisterUserDto) {
        // find user and check if this user does not exist
        const user = await this.usersService.findUserByEmail(userInfo.email)
        if (user) throw new BadRequestException('this user has already exist')
        // hash password and save user to the database
        userInfo.password = await this.usersService.hashValue(userInfo.password)
        return this.usersService.saveUser(userInfo)
    }

    async loginUser(userInfo: LoginUserDto) {
        const { email, password: enteredPassword } = userInfo
        // check if this user has already exist in database
        const user = await this.usersService.findUserByEmail(email)
        if (!user) throw new NotFoundException('there is no account with this gmail')
        // check password of the user
        const isPasswordCorrect = await this.usersService.compareDataWithEncrypted(enteredPassword, user.password)
        if(!isPasswordCorrect) throw new UnauthorizedException('password incorrect')
        const { password, hashedRefreshToken, ...userWithoutPassword } = user
        return userWithoutPassword
    }

    async updateUser(userId: string, userInfo: UpdateUserDto) {
        // find user by the given id
        const user = await this.usersService.findUserById(userId)
        if (!user) throw new NotFoundException('there is no account with this gmail')
        // if trying to edit password, check the old password is correct
        if (userInfo.oldPassword) {
            const isPasswordCorrect = this.usersService.compareDataWithEncrypted(userInfo.oldPassword, user.password)
            if(!isPasswordCorrect) throw new UnauthorizedException('password incorrect')
            userInfo.password = await this.usersService.hashValue(userInfo.password)
        }
        // if trying to edit email, check email is not already for another account
        if (userInfo.email) {
            const foundUser = await this.usersService.findUserByEmail(userInfo.email)
            if(foundUser) throw new ConflictException('the email you have entered is already in use')
        }
        // edit user
        return await this.usersService.findUserAndUpdate(userId, { ...user, ...userInfo })
    }

    async generateJWTCookies(user: User) {
        const accessTokenCookie = this.getJWTAccessTokenCookie(user.email)
        console.log('\n access token cookie is', accessTokenCookie)
        const { cookie: refreshTokenCookie, token: refreshToken } = this.getCookieWithJwtRefreshToken(user.email)
        console.log('\n refresh token cookie is: ', refreshTokenCookie)
        // save refresh token to the database
        await this.usersService.saveRefreshTokenToDatabase(refreshToken, user.email)
        return { accessTokenCookie, refreshTokenCookie }
    }

    getJWTAccessTokenCookie(userEmail: string) {
        const token = sign(
          { email: userEmail },
          this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
          { expiresIn: this.configService.get<string>('JWT_ACCESS_TOKEN_EXPIRATION_TIME') }
        )
        return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME')}`;
    }

    getCookieWithJwtRefreshToken(userEmail: string) {
        const token = sign(
          { email: userEmail },
          this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
          { expiresIn: this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRATION_TIME') }
        )
        const cookie = `Refresh=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME')}`;
        return { cookie, token }
    }

    async verifyAccessToken(token: string) {
        try {
            console.log('\n verifying the token...')
            const decoded: any = verify(
                token,
                this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET')
            )
            console.log('\n token was successfully verified', decoded)
            const { password, hashedRefreshToken, ...user } = await this.usersService.findUserByEmail(decoded.email)
            return user
        } catch (error) {
            throw new BadRequestException('unable to verify token')
        }
    }

    getCookiesForLogOut() {
        return [
          'Authentication=; HttpOnly; Path=/; Max-Age=0',
          'Refresh=; HttpOnly; Path=/; Max-Age=0'
        ];
    }
}