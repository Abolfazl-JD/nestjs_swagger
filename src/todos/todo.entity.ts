import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { AbstractDocument } from "src/common/abstract.schema";

@Schema({ versionKey: false, timestamps: true })
export class Todo extends AbstractDocument {
    /**
     * Work to do
    */
    @Prop()
    task: string

    /**
     * Additional information about the task
    */
    @Prop()
    description?: string

    /**
     * Determine if task is done or not
    */
    @Prop({
        required: false,
        default: false
    })
    done: boolean = false
}

export const TodoSchema = SchemaFactory.createForClass(Todo);