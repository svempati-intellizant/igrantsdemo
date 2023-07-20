import { Prop, Schema } from "@nestjs/mongoose";
import { Schema as MongooseSchema } from "mongoose";
@Schema({
  timestamps: false,
})
export class AnswerDefaultSchema {
  @Prop({
    type: MongooseSchema.Types.String,
    required: false,
  })
  value: string;

  @Prop({
    type: MongooseSchema.Types.Number,
    required: true,
    min: 1,
    max: 5,
  })
  weightage: number;

  @Prop({
    type: MongooseSchema.Types.String,
    required: false,
  })
  prescription: string;
}
