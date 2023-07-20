import { Prop, Schema } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from "mongoose";
@Schema({
  timestamps: true,
})
export class RiskAnalysisSchema {
  @Prop({
    type: MongooseSchema.Types.Number,
    required: true,
  })
  Performance_Risk: number;

  @Prop({
    type: MongooseSchema.Types.Number,
    required: true,
  })
  Financial_Risk: number;

  @Prop({
    type: MongooseSchema.Types.Number,
    required: true,
  })
  Quality_Risk: number;

  @Prop({
    type: MongooseSchema.Types.Number,
    required: true,
  })
  Complaince_Risk: number;

  @Prop({
    type: MongooseSchema.Types.Number,
    required: true,
  })
  year: number;
}
