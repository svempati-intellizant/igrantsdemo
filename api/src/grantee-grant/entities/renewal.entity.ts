import { Prop, Schema } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from "mongoose";
@Schema({
  timestamps: true,
})
export class RenewalSchema extends Document {
  @Prop({
    type: MongooseSchema.Types.String,
    required: true,
  })
  renewal_fund: string;

  @Prop({
    type: MongooseSchema.Types.Boolean,
    required: true,
    default: false,
  })
  is_renewed: boolean;
}
