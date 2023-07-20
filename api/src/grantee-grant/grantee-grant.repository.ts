import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { GranteeGrant } from "./entities/grantee-grant.entity";
import { Model, ObjectId } from "mongoose";
import { GranteeGrantDocument } from "./grantee-grant.schema";
import { CreateGranteeGrantDto } from "./dto/create-grantee-grant.dto";
import { RenewGrantDTO } from "./dto/renew-grantee-grant.dto";

@Injectable()
export class GranteeGrantRepository {
  constructor(
    @InjectModel(GranteeGrant.name)
    private granteeGrantModel: Model<GranteeGrantDocument>
  ) {}

  createNewRecord(grante_grant_details: CreateGranteeGrantDto) {
    return new this.granteeGrantModel(grante_grant_details).save({
      validateBeforeSave: true,
      timestamps: true,
    });
  }

  findSubmittedGranteeGrant(_id: ObjectId) {
    return this.granteeGrantModel
      .findOne({ _id, is_submit: true })
      .populate(["grantee_master_id", "grant_master_id"])
      .then((res) => res)
      .catch((err) => err);
  }

  findAll() {
    return this.granteeGrantModel
      .find()
      .populate(["grant_master_id", "grantee_master_id"]);
  }
  findPortFolioAtRisk() {
    return this.granteeGrantModel
      .find({
        risk_score: { $exists: true, $ne: null },
        polled_from_ai: true,
        is_submit: true,
      })
      .populate(["grant_master_id", "grantee_master_id"]);
  }
  findOngoingGrantee() {
    return this.granteeGrantModel
      .find()
      .populate({
        path: "grant_master_id",
        select: ["grant_from_date", "grant_to_date", "grant_id"],
        match: {
          $and: [
            { grant_from_date: { $lt: new Date() } },
            { grant_to_date: { $gt: new Date() } },
          ],
        },
      })
      .populate({
        path: "grantee_master_id",
      })
      .then((data) => data.filter((_data) => _data.grant_master_id))
      .catch((err) => err);
  }

  findCompletedGrantee() {
    return this.granteeGrantModel
      .find()
      .populate({
        path: "grantee_master_id",
      })
      .populate({
        path: "grant_master_id",
        select: ["grant_from_date", "grant_to_date", "grant_id"],
        match: {
          grant_to_date: { $lt: new Date() },
        },
      })
      .then((data) => data.filter((_data) => _data.grant_master_id))
      .catch((err) => err);
  }

  canAvailForRenewal(renewGrant: RenewGrantDTO) {
    return this.granteeGrantModel.find({
      $and: [
        {
          _id: renewGrant.grantee_grant_id,
          is_submit: true,
          polled_from_ai: true,
        },
        {
          $or: [
            { renewals: { $not: { $exists: true } } },
            {
              renewals: {
                $not: { $elemMatch: { is_renewed: { $nin: [true] } } },
              },
            },
          ],
        },
      ],
    });
  }

  availNewGrant(renewGrant: RenewGrantDTO) {
    return this.granteeGrantModel.findOneAndUpdate(
      { _id: renewGrant.grantee_grant_id },
      { $push: { renewals: renewGrant.renewal_details } },
      { upsert: true, new: true }
    );
  }

  findGranteeGrant(grant_master_id: ObjectId, grantee_master_id: ObjectId) {
    return this.granteeGrantModel
      .findOne({
        grantee_master_id,
        grant_master_id,
      })
      .lean();
  }

  findSingleGranteeGrant(grantee_master_id: ObjectId) {
    return this.granteeGrantModel.findOne({
      grantee_master_id,
      risk_score: { $exists: true, $ne: null },
    });
    // .lean();
  }

  findGrantsForRespectiveGrant(grantee_master_id: ObjectId) {
    return this.granteeGrantModel
      .find({ grantee_master_id })
      .populate(["grant_master_id"])
      .populate({ path: "grantee_master_id", select: "grantee_name" });
  }

  findGranteeRecord(grantee_master_id: ObjectId) {
    return this.granteeGrantModel
      .findOne({ grantee_master_id })
      .populate(["grant_master_id"]);
  }

  granteeUnderGrant(grant_master_id: ObjectId) {
    return this.granteeGrantModel
      .findOne({ grant_master_id })
      .populate(["grantee_master_id", "grant_master_id"]);
  }
  updateSaveOrSubmit(_id: ObjectId, is_submit: boolean) {
    return this.granteeGrantModel.findOneAndUpdate(
      { _id },
      { is_submit },
      { upsert: true, new: true }
    );
  }

  async findSingleMultiGrant(grantee_master_id: ObjectId) {
    return await this.granteeGrantModel
      .find({ grantee_master_id })
      .populate(["grant_master_id"]);
  }

  updateRiskScore(res) {
    return this.granteeGrantModel.findOneAndUpdate(
      { _id: res.grantee_grant_id },
      {
        risk_score: res.risk_score,
        polled_from_ai: true,
        weightage: res.weightage,
      },
      { upsert: true, new: true }
    );
  }
}
