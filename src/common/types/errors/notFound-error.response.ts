import { ApiExtraModels, ApiProperty } from "@nestjs/swagger";
import { AbstractErrorResponse } from "./abstract-error.response";

@ApiExtraModels(AbstractErrorResponse)
export class NotFoundErrorResponse extends AbstractErrorResponse {
    @ApiProperty({ example: 404 })
    statusCode: number;

    @ApiProperty({ example: 'Not Found' })
    error: string;
}