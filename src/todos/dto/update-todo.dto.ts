import { IsBoolean, IsOptional, IsString } from "class-validator";

export class UpdateTodoDto {
    /**
     * Work to do
     @example Cooking
    */
    @IsOptional()
    @IsString()
    task?: string

    /**
     * Additional information about the task
     @example 'after having breakfast'
    */
    @IsOptional()
    @IsString()
    description?: string

    /**
     * Determine if task is done or not
    */
    @IsOptional()
    @IsBoolean()
    done?: boolean
}