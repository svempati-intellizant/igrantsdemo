import { Document } from "mongoose";
import { SchemaFactory } from "@nestjs/mongoose";
import { QuestionMaster } from "./entities/question-master.entity";
import { AnswerDefaultSchema } from "./entities/answer-default.entity";

export type QuestionMasterDocument = Document & QuestionMaster;

export const QuestionMasterSchema = SchemaFactory.createForClass(
  QuestionMaster
);
