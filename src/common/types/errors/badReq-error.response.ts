import { ApiExtraModels, ApiProperty } from "@nestjs/swagger";
import { AbstractErrorResponse } from "./abstract-error.response";

@ApiExtraModels(AbstractErrorResponse)
export class BadReqErrorResponse extends AbstractErrorResponse {
    @ApiProperty({ example: 400 })
    statusCode: number;

    @ApiProperty({ example: 'Bad Request' })
    error: string
}