import { ApiExtraModels, ApiProperty } from "@nestjs/swagger";
import { AbstractErrorResponse } from "./abstract-error.response";

@ApiExtraModels(AbstractErrorResponse)
export class ConflictErrorResponse extends AbstractErrorResponse {
    @ApiProperty({ example: 409 })
    statusCode: number;

    @ApiProperty({ example: 'Conflict' })
    error: string
}