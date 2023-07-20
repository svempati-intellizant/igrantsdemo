import { Prop, Schema } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from "mongoose";
import { AnswerDefaultSchema } from "./answer-default.entity";
@Schema({
  timestamps: true,
})
export class QuestionMaster extends Document {
  @Prop({
    type: MongooseSchema.Types.Number,
    required: false,
  })
  sequence_no: number;

  @Prop({
    type: MongooseSchema.Types.String,
    required: true,
  })
  risk_type: string;

  @Prop({
    type: MongooseSchema.Types.String,
    required: true,
  })
  question: string;

  @Prop({
    type: MongooseSchema.Types.String,
    required: true,
  })
  questionSno: string;

  @Prop([
    {
      type: AnswerDefaultSchema,
      required: true,
    },
  ])
  answer_impact_values: [AnswerDefaultSchema];

  @Prop({
    type: MongooseSchema.Types.Number,
    required: true,
    min: 1,
    max: 5,
  })
  question_impact_values: number;

  @Prop({
    type: MongooseSchema.Types.Number,
    required: true,
    min: 1,
    max: 10,
  })
  probaility: number;
}
