import { Prop, Schema } from "@nestjs/mongoose";
import { ObjectId, Schema as MongooseSchema } from "mongoose";
import { OptionSelectedByUser } from "./option-selected.entity";
@Schema({
  timestamps: true,
})
export class Answer {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: "GranteeGrant",
  })
  grantee_grant_id: ObjectId;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: "QuestionMaster",
  })
  question_id: ObjectId;

  @Prop({
    type: OptionSelectedByUser,
    required: true,
  })
  answer: OptionSelectedByUser;
}
