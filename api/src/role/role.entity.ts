import { Prop, Schema } from "@nestjs/mongoose";
import { Schema as MongooseSchema } from "mongoose";

@Schema({
  timestamps: true,
})
export class Role {
  @Prop({
    type: MongooseSchema.Types.String,
    required: false,
  })
  name: string;
}
