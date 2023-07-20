import { Document } from "mongoose";
import { SchemaFactory } from "@nestjs/mongoose";
import { GrantMaster } from "./entities/grant-master.entity";

export type GrantMasterDocument = Document & GrantMaster;

export const GrantMasterSchema = SchemaFactory.createForClass(GrantMaster);
