import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsNotEmpty, IsString } from "class-validator"

export class RegisterUserDto {
    /**
     * User's email to sign up
    @example name@gmail.com
    */
    @IsNotEmpty()
    @IsEmail()
    email: string

    /**
     * Name of the user
     @example Ali
    */
    @IsNotEmpty()
    @IsString()
    name: string

    /**
     * password of User
     @example password
    */
    @IsNotEmpty()
    @IsString()
    password: string
}