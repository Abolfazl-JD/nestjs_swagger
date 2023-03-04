import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { AbstractDocument } from "src/common/abstract.schema";

@Schema({ versionKey: false, timestamps: true })
export class User extends AbstractDocument {
    @Prop()
    @ApiProperty()
    email: string

    @Prop()
    password: string

    @Prop()
    @ApiProperty()
    name: string

    @Prop()
    @ApiProperty()
    hashedRefreshToken: string
}

export const UserSchema = SchemaFactory.createForClass(User);