import { IsOptional, IsString } from "class-validator"

export class UpdateUserDto {
    /**
     * New name of the user
     @example Ali
    */
    @IsOptional()
    @IsString()
    name?: string

    /**
     * New email to use
    @example new@gmail.com
    */
    @IsOptional()
    @IsString()
    email?: string

    /**
     * New password to use
     @example Newpassword
    */
    @IsOptional()
    @IsString()
    password?: string

    /**
     * Old password (required if trying to change password)
     @example oldpassword
    */
    @IsOptional()
    @IsString()
    oldPassword?: string
}