import { Document } from "mongoose";
import { SchemaFactory } from "@nestjs/mongoose";
import { GranteeMaster } from "./entities/grantee-master.entity";

export type GranteeMasterDocument = Document & GranteeMaster;

export const GranteeMasterSchema = SchemaFactory.createForClass(GranteeMaster);
