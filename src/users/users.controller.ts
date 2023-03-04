import { Body, Controller, Get, HttpCode, NotFoundException, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiConflictResponse, ApiCreatedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiParam, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthorizedReq } from 'src/common/types/authorized-req';
import { BadReqErrorResponse } from 'src/common/types/errors/badReq-error.response';
import { ConflictErrorResponse } from 'src/common/types/errors/conflict-error.response';
import { ForbiddenErrorResponse } from 'src/common/types/errors/forbidden-error.response';
import { NotFoundErrorResponse } from 'src/common/types/errors/notFound-error.response';
import { UnauthorizedErrorResponse } from 'src/common/types/errors/unauthorized-error.response';
import { UserResponse } from 'src/common/types/responses/user.response';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthorizationGuard } from './guards/authorization.guard';
import { JWTRefreshGuard } from './guards/jwt-refresh.guard';
import { UpdateUserGuard } from './guards/update-user.guard';
import { User } from './user.entity';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {

    constructor(
        private readonly usersService: UsersService,
        private readonly authService: AuthService
    ){}
    
    /**
        * Register new user
    */
    @ApiCreatedResponse({ description: "user created", type: UserResponse })
    @ApiBadRequestResponse({ description: 'user you are tryning to signup has already been created', type: BadReqErrorResponse })
    @Post('register')
    async signupUser(@Body() userInfo: RegisterUserDto, @Req() req: Request) {
        const { hashedRefreshToken, ...user } = await this.authService.signupUser(userInfo)
        console.log('\n signed up user is : ', user)
        const { accessTokenCookie, refreshTokenCookie } = await this.authService.generateJWTCookies(user as User)

        req.res.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie])
        return user
    }

    /**
     * Login user
    */
    @Post('login')
    @ApiOkResponse({ description: 'user logged in successfully', type: UserResponse })
    @ApiNotFoundResponse({ description: 'gmail not found to log in', type: NotFoundErrorResponse })
    @ApiUnauthorizedResponse({ description: 'password incorrect', type: UnauthorizedErrorResponse })
    async loginUser(@Body() userInfo: LoginUserDto, @Req() req: Request) {
        const user = await this.authService.loginUser(userInfo)
        console.log('\n logged in user is:', user)
        const { accessTokenCookie, refreshTokenCookie } = await this.authService.generateJWTCookies(user as User)

        req.res.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie])
        return user
    }

    /**
     * Set new authentication (access token) cookie
    */
    @ApiOkResponse({ description: 'new authentication cookie has been set', type: UserResponse })
    @ApiBadRequestResponse({ description: 'unable to verify the token', type: BadReqErrorResponse })
    @ApiUnauthorizedResponse({ description: 'no cookies were found', type: UnauthorizedErrorResponse })
    @ApiForbiddenResponse({ description: 'refresh token didn not match', type: ForbiddenErrorResponse })
    @UseGuards(JWTRefreshGuard)
    @Get('refresh')
    refresh(@Req() req: AuthorizedReq) {
        console.log('\n testing current user decorator : ', req.user)
        const accessTokenCookie = this.authService.getJWTAccessTokenCookie(req.user.email)
        console.log('\n new access token cookie is: ', accessTokenCookie)
        req.res.setHeader('Set-Cookie', accessTokenCookie)
        return req.user
    }

    /**
     * Log out the user 
    */
    @ApiOkResponse({ description: 'you have been successfully logged out', type: String })
    @ApiUnauthorizedResponse({ description: 'No cookies were found', type: UnauthorizedErrorResponse })
    @ApiBadRequestResponse({ description: 'Unable to verify the token', type: BadReqErrorResponse })
    @UseGuards(AuthorizationGuard)
    @Post('logout')
    @HttpCode(200)
    async logOut(@Req() req: AuthorizedReq) {
        await this.usersService.removeRefreshTokenFromDatabase(req.user.email)
        req.res.setHeader('Set-Cookie', this.authService.getCookiesForLogOut())
        return 'you have been successfully logged out'
    }

    /**
     * Return A user by given id
    */
    @ApiParam({
        description: "User's id",
        required: true,
        example: '7fo5ges1god670gt',
        name: "id"
    })
    @ApiOkResponse({ description: 'User was successfully found', type: UserResponse })
    @ApiNotFoundResponse({ description: 'User was not found', type: NotFoundErrorResponse })
    @Get(':id')
    async getSingleUser(@Param('id') id: string) {
        const { hashedRefreshToken, password, ...user } = await this.usersService.findUserById(id)
        if(!user) throw new NotFoundException(`user with id of ${id} was not found`)
        return user
    }

    /**
     * Update user
    */
    @ApiParam({
        description: "User's id",
        required: true,
        example: '7fo5ges1god670gt',
        name: "id"
    })
    @ApiOkResponse({ description: 'User was updated successfully', type: UserResponse })
    @ApiUnauthorizedResponse({ description: 'No cookies were found/Password incorrect ', type: UnauthorizedErrorResponse })
    @ApiBadRequestResponse({ description: 'Unable to verify the token', type: BadReqErrorResponse })
    @ApiNotFoundResponse({ description: 'User was not found', type: NotFoundErrorResponse })
    @ApiConflictResponse({ description: 'gmail in use by another one', type: ConflictErrorResponse })
    @ApiForbiddenResponse({
         description: "Id param doesn't match the id of user to edit",
         type: ForbiddenErrorResponse 
    })
    @UseGuards(AuthorizationGuard, UpdateUserGuard)
    @Patch(':id')
    async updateUser(@Param('id') id: string, @Body() userInfo: UpdateUserDto) {
        const {hashedRefreshToken ,password, ...user} = await  this.authService.updateUser(id, userInfo)
        return user
    }

}
