import { ApiExtraModels, ApiProperty } from "@nestjs/swagger";
import { AbstractErrorResponse } from "./abstract-error.response";

@ApiExtraModels(AbstractErrorResponse)
export class UnauthorizedErrorResponse extends AbstractErrorResponse {
    @ApiProperty({ example: 401 })
    statusCode: number;

    @ApiProperty({ example: 'Unauthorized' })
    error: string
}