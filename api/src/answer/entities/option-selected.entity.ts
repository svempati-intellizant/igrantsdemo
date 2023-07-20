import { Prop, Schema } from "@nestjs/mongoose";
import { Schema as MongooseSchema } from "mongoose";
@Schema({
  timestamps: false,
})
export class OptionSelectedByUser {
  @Prop({
    type: MongooseSchema.Types.String,
    required: true,
  })
  value: string;
  @Prop({
    type: MongooseSchema.Types.Number,
    required: true,
  })
  weightage: number;

  @Prop({
    type: MongooseSchema.Types.String,
    required: false,
  })
  description: string;

  @Prop({
    type: MongooseSchema.Types.String,
    required: false,
  })
  file_path: string;
}
