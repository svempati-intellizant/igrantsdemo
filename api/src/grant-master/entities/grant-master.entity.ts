import { Prop, Schema } from "@nestjs/mongoose";
import { ObjectId, Schema as MongooseSchema } from "mongoose";
@Schema({
  timestamps: true,
})
export class GrantMaster {
  @Prop({
    type: MongooseSchema.Types.String,
    required: true,
    unique: true,
  })
  grant_name: string;

  @Prop({
    type: MongooseSchema.Types.String,
    required: true,
    unique: true,
  })
  grant_id: string;

  @Prop({
    type: MongooseSchema.Types.Number,
    required: true,
  })
  grant_authorized: number;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: "User",
  })
  grant_alloted_by: ObjectId;

  @Prop({
    type: MongooseSchema.Types.Date,
  })
  grant_from_date: Date;

  @Prop({
    type: MongooseSchema.Types.Date,
  })
  grant_to_date: Date;

  @Prop({
    type: MongooseSchema.Types.String,
    required: true,
  })
  agency: string;

  @Prop({
    type: MongooseSchema.Types.String,
    required: true,
  })
  program: string;
}
