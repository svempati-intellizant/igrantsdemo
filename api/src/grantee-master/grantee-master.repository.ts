import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, ObjectId } from "mongoose";
import { CreateGranteeMasterDtoWithUserID } from "./dto/create-grantee-master.dto";
import { GranteeMaster } from "./entities/grantee-master.entity";
import { GranteeMasterDocument } from "./grantee-master.schema";

@Injectable()
export class GranteeMasterRepository {
  constructor(
    @InjectModel(GranteeMaster.name)
    private granteeModal: Model<GranteeMasterDocument>
  ) {}

  createGrantee(grantee_details: CreateGranteeMasterDtoWithUserID) {
    return new this.granteeModal(grantee_details).save({
      validateBeforeSave: true,
      timestamps: true,
    });
  }

  findAll() {
    return this.granteeModal.find();
  }

  findOne(grantee_id: ObjectId) {
    return this.granteeModal.findOne({ _id: grantee_id });
  }

  pushGranteeFromSAF(grantee) {
    return this.granteeModal.findOneAndUpdate(
      {
        grantee_name: grantee["grantee_name"],
        ein: grantee["ein"],
      },
      {
        grantee_name: grantee["grantee_name"],
        ein: grantee["ein"],
      },
      {
        upsert: true,
        new: true,
      }
    );
  }
}
