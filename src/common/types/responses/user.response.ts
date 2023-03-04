import { ApiProperty } from "@nestjs/swagger"

export class UserResponse {
    @ApiProperty({ example: 'name@gamil.com' })
    email: string
    
    name: string

    id: string
}