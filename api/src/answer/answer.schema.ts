import { Document } from "mongoose";
import { SchemaFactory } from "@nestjs/mongoose";
import { Answer } from "./entities/answer.entity";

export type AnswerDocument = Document & Answer;

export const AnswerSchema = SchemaFactory.createForClass(Answer);
