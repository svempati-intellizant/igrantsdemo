import { Prop, Schema } from "@nestjs/mongoose";
import { ObjectId, Schema as MongooseSchema } from "mongoose";
@Schema({
  timestamps: true,
})
export class GranteeMaster {
  @Prop({
    type: MongooseSchema.Types.String,
    required: true,
    unique: true,
  })
  grantee_name: string;

  @Prop({
    type: MongooseSchema.Types.String,
    required: true,
  })
  occupation: string;

  @Prop({
    type: MongooseSchema.Types.String,
    required: true,
    unique: true,
  })
  ein: string;

  @Prop({
    type: MongooseSchema.Types.String,
    required: true,
  })
  name_of_institution: string;

  @Prop({
    type: MongooseSchema.Types.String,
    required: true,
  })
  address: string;

  @Prop({
    type: MongooseSchema.Types.String,
    required: true,
  })
  contact_details: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: "User",
  })
  user_id: ObjectId;
}

//New Grantee - Name, Occupation, Name of Institution, Address, Contact details
