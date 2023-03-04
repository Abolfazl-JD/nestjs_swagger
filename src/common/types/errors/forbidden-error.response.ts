import { ApiExtraModels, ApiProperty } from "@nestjs/swagger";
import { AbstractErrorResponse } from "./abstract-error.response";

@ApiExtraModels(AbstractErrorResponse)
export class ForbiddenErrorResponse extends AbstractErrorResponse {
    @ApiProperty({ example: 403 })
    statusCode: number;

    @ApiProperty({ example: 'Forbidden' })
    error: string
}