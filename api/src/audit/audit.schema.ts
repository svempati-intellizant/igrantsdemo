import { Document } from "mongoose";
import { SchemaFactory } from "@nestjs/mongoose";
import { Audit } from "./entities/audit.entity";

export type AuditDocument = Document & Audit;

export const AuditSchema = SchemaFactory.createForClass(Audit);
