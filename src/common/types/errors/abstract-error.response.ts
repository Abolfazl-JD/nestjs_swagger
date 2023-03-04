import { ApiProperty } from "@nestjs/swagger";

export class AbstractErrorResponse {
    @ApiProperty()
    statusCode: number;
  
    @ApiProperty({ example: 'message' })
    message: string;

    @ApiProperty()
    error: string;
}
  