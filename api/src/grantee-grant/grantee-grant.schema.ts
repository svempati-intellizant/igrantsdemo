import { Document } from "mongoose";
import { SchemaFactory } from "@nestjs/mongoose";
import { GranteeGrant } from "./entities/grantee-grant.entity";

export type GranteeGrantDocument = Document & GranteeGrant;

export const GranteeGrantSchema = SchemaFactory.createForClass(GranteeGrant);
