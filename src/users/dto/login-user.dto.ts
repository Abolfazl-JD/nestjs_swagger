import { IsEmail, IsNotEmpty, IsString } from "class-validator"

export class LoginUserDto {
    /**
     @example name@gmail.com 
    */
    @IsNotEmpty()
    @IsEmail()
    email: string

    @IsNotEmpty()
    @IsString()
    password: string
}