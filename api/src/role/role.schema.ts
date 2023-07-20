import { Document } from "mongoose";
import { SchemaFactory } from "@nestjs/mongoose";
import { Role } from "./role.entity";

export type RoleDocument = Document & Role;

export const RoleSchema = SchemaFactory.createForClass(Role);
