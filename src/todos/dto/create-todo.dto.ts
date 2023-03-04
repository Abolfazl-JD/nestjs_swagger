import { IsNotEmpty, IsOptional, IsString } from "class-validator"

export class CreateTodoDto {
    /**
     * Work to do
     @example Cooking
    */
    @IsNotEmpty()
    @IsString()
    task: string

    /**
     * Additional information about the task
     @example 'after having breakfast'
    */
    @IsOptional()
    @IsString()
    description?: string
}