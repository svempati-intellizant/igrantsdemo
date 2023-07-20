import { Prop, Schema } from "@nestjs/mongoose";
import {
  Mongoose,
  ObjectId,
  Schema as MongooseSchema,
  SchemaType,
  SchemaTypes,
} from "mongoose";
import { RenewalSchema } from "./renewal.entity";
import { RiskAnalysisSchema } from "./risk-analysis.entity";
@Schema({
  timestamps: true,
})
export class GranteeGrant {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: "GranteeMaster",
    required: true,
  })
  grantee_master_id: ObjectId;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: "GrantMaster",
    required: true,
  })
  grant_master_id: ObjectId;

  @Prop({
    type: Object,
    required: false,
  })
  risk_score: Object;

  @Prop({
    type: MongooseSchema.Types.Boolean,
    required: false,
    default: false,
  })
  polled_from_ai: boolean;

  @Prop([
    {
      type: RiskAnalysisSchema,
      required: false,
    },
  ])
  risk_analysis: [RiskAnalysisSchema];

  @Prop([
    {
      type: RenewalSchema,
      required: false,
    },
  ])
  renewals: [RenewalSchema];

  @Prop({
    type: Object,
    required: false,
  })
  weightage: Object;

  @Prop({
    type: MongooseSchema.Types.Boolean,
    required: false,
    default: false,
  })
  is_submit: boolean;
}
// {
//   PerformanceRisk:78.4,
//   ComplainceRisk:78.4,
//   FinanceRisk:78.4,
//   QualityRisk:78.4,
//   OverallRisk:78.4,
// }

// {
//   PerformanceRisk:78.4,
//   ComplainceRisk:78.4,
//   FinanceRisk:78.4,
//   QualityRisk:78.4,
//   SAFRisk:78.4,
//   OverallRisk:78.4,
// }
