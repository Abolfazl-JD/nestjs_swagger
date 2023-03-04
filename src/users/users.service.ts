import { ForbiddenException, Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { compare, genSalt, hash } from 'bcrypt'
import { User } from './user.entity';
import { RegisterUserDto } from './dto/register-user.dto';

@Injectable()
export class UsersService {
    constructor(private readonly usersRepository: UsersRepository){}

    findUserByEmail(email: string) {
        return this.usersRepository.findOne({ email })
    }

    findUserById(id: string){
        return this.usersRepository.findOne({ _id: id })
    }

    findUserAndUpdate(userId: string, updateUserInfo: User){
        return this.usersRepository.findOneAndUpdate({ _id: userId }, updateUserInfo)
    }

    async hashValue(data: string) {
        const salt = await genSalt(10)
        return hash(data, salt)
    }

    async saveUser(userInfo: RegisterUserDto) {
        const { password, ...savedUser } = await this.usersRepository.create({
            ...userInfo,
            hashedRefreshToken: ''
        })
        return savedUser
    }

    async saveRefreshTokenToDatabase(refreshToken: string, userEmail: string) {
        const hashedRefreshToken = await this.hashValue(refreshToken)
        console.log('\n saving hashed refresh token to the database :', hashedRefreshToken)
        await this.usersRepository.findOneAndUpdate({ email: userEmail }, { hashedRefreshToken })
    }

    async compareDataWithEncrypted(dataToCheck: string, encryptedData: string) {
        const isMatched = await compare(dataToCheck, encryptedData)
        return isMatched
    }

    async getUserIfRefreshTokenMatches(refreshToken: string, userEmail: string) {
        const user = await this.findUserByEmail(userEmail)
        console.log('\n gotten data by id: ', user)
        const isRefreshTokenMatching = await this.compareDataWithEncrypted(
          refreshToken,
          user.hashedRefreshToken
        )
        console.log('\n refresh token matches ?', isRefreshTokenMatching)
        const { password, hashedRefreshToken, ...newUser } = user
        if (isRefreshTokenMatching) return newUser
        throw new ForbiddenException("refresh token didn't match")
    }

    removeRefreshTokenFromDatabase(email: string) {
        return this.usersRepository.findOneAndUpdate({ email }, {
          hashedRefreshToken: ''
        })
    }
}
