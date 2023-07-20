import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AuditDocument } from "./audit.schema";
import { Audit } from "./entities/audit.entity";

@Injectable()
export class AuditRepository {
  constructor(
    @InjectModel(Audit.name)
    private GrantModal: Model<AuditDocument>
  ) {}

  pushDummy(data) {
    return this.GrantModal.insertMany(data);
  }
}
