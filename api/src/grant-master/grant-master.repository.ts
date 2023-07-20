import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, ObjectId } from "mongoose";
import { CreateGrantMasterDtoWithUserID } from "./dto/create-grant-master.dto";
import { GrantMaster } from "./entities/grant-master.entity";
import { GrantMasterDocument } from "./grant-master.schema";

@Injectable()
export class GrantMasterRepository {
  constructor(
    @InjectModel(GrantMaster.name)
    private GrantModal: Model<GrantMasterDocument>
  ) {}

  createGrant(grant_details: CreateGrantMasterDtoWithUserID) {
    return new this.GrantModal(grant_details).save({
      validateBeforeSave: true,
      timestamps: true,
    });
  }

  fetchAllGrant() {
    return this.GrantModal.find();
  }

  pushGrantFromSAF(grant) {
    return this.GrantModal.findOneAndUpdate(
      {
        grant_name: grant["grant_name"],
        grant_id: grant["grant_id"],
      },
      {
        grant_name: grant["grant_name"],
        grant_authorized: grant["grant_authorized"],
        grant_from_date: grant["grant_from_date"],
        grant_to_date: grant["grant_to_date"],
        grant_id: grant["grant_id"],
      },
      {
        upsert: true,
        new: true,
      }
    );
  }
}
