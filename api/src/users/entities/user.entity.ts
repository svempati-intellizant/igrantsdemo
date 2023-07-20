import { Prop, Schema } from "@nestjs/mongoose";
import { Schema as MongooseSchema } from "mongoose";
@Schema({
  timestamps: true,
})
export class User {
  @Prop({
    type: MongooseSchema.Types.String,
    required: false,
  })
  password: string;

  @Prop({
    type: MongooseSchema.Types.String,
    required: true,
    unique: true,
  })
  email: string;

  @Prop({
    type: MongooseSchema.Types.String,
    required: true,
  })
  role: string;

  @Prop({
    type: MongooseSchema.Types.String,
    required: false,
  })
  agency: string;
}
