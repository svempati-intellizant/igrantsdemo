import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ObjectId } from "mongoose";
import { CreateGranteeGrantDto } from "./dto/create-grantee-grant.dto";
import { RenewGrantDTO } from "./dto/renew-grantee-grant.dto";
import { UpdateGranteeGrantDto } from "./dto/update-grantee-grant.dto";
import { GranteeGrantRepository } from "./grantee-grant.repository";
import * as moment from "moment";

@Injectable()
export class GranteeGrantService {
  constructor(
    private readonly granteeGrantRepository: GranteeGrantRepository
  ) {}
  create(createGranteeGrantDto: CreateGranteeGrantDto) {
    return this.granteeGrantRepository.createNewRecord(createGranteeGrantDto);
  }

  async findAll() {
    const allGranteeGrant = await this.granteeGrantRepository.findAll();

    return allGranteeGrant;
  }

  async renewGrant(renewGrant: RenewGrantDTO) {
    try {
      const canAvailForRenewal = await this.granteeGrantRepository.canAvailForRenewal(
        renewGrant
      );

      if (!canAvailForRenewal.length)
        throw new HttpException(
          "Can't Renew Grant ",
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      const availNewGrant = await this.granteeGrantRepository.availNewGrant(
        renewGrant
      );
      if (!availNewGrant)
        throw new HttpException(
          "Can't Renew Grant",
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      console.log(availNewGrant);
      return availNewGrant;
    } catch (error) {
      console.log(error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async findGrantsForRespectiveGrant(id: ObjectId) {
    const today = new Date();

    const all_grantee = await this.granteeGrantRepository.findGrantsForRespectiveGrant(
      id
    );
    const grantListWithRiskScore = all_grantee.map((each_grant) => {
      const temp_grantee_risk = each_grant.toObject();
      if (
        !temp_grantee_risk ||
        !temp_grantee_risk["risk_score"] ||
        !temp_grantee_risk["risk_score"]["Total Risk"]
      )
        return { ...temp_grantee_risk, risk: "Not Calculated" };
      else {
        let risk = "";
        if (
          temp_grantee_risk["risk_score"]["Total Risk"] > 0 &&
          temp_grantee_risk["risk_score"]["Total Risk"] <= process.env.LOW_RISK
        )
          risk = "good";
        else if (
          temp_grantee_risk["risk_score"]["Total Risk"] >
            process.env.LOW_RISK &&
          temp_grantee_risk["risk_score"]["Total Risk"] < process.env.HIGH_RISK
        )
          risk = "medium";
        else if (
          temp_grantee_risk["risk_score"]["Total Risk"] >= process.env.HIGH_RISK
        )
          risk = "high";
        return { ...temp_grantee_risk, risk: risk };
      }
    });
    const grantWithStatus = grantListWithRiskScore.map((each_grant) => {
      if (
        moment(today).isAfter(each_grant.grant_master_id["grant_to_date"]) &&
        each_grant.risk_score
      )
        return { ...each_grant, grant_status: "completed" };
      else if (
        moment(today).isBefore(each_grant.grant_master_id["grant_to_date"]) &&
        each_grant.risk_score
      )
        return { ...each_grant, grant_status: "ongoing" };
      else if (!each_grant.risk_score)
        return { ...each_grant, grant_status: "fresh" };
      else if (
        !each_grant.risk_score &&
        moment(today).isBefore(each_grant.grant_master_id["grant_to_date"])
      )
        return { ...each_grant, grant_status: "fresh" };
    });
    console.log(grantWithStatus);
    if (!grantWithStatus.length)
      throw new HttpException("No Grant Records Found", HttpStatus.BAD_GATEWAY);
    return grantWithStatus;
  }

  async findRiskForGrant(id: ObjectId) {
    const grant = await this.granteeGrantRepository.granteeUnderGrant(id);

    if (!grant)
      throw new HttpException("No Risk Present", HttpStatus.NOT_FOUND);
    return grant;
  }

  async findGranteeGrant(
    grant_master_id: ObjectId,
    grantee_master_id: ObjectId
  ) {
    return await this.granteeGrantRepository.findGranteeGrant(
      grant_master_id,
      grantee_master_id
    );
  }

  async updateSaveOrSubmit(grantee_grant_id: ObjectId, is_submit: boolean) {
    return await this.granteeGrantRepository.updateSaveOrSubmit(
      grantee_grant_id,
      is_submit
    );
  }

  async granteeUnderGrant(grant_master_id: ObjectId) {
    return this.granteeGrantRepository.granteeUnderGrant(grant_master_id);
  }
  update(id: number, updateGranteeGrantDto: UpdateGranteeGrantDto) {
    return `This action updates a #${id} granteeGrant`;
  }

  remove(id: number) {
    return `This action removes a #${id} granteeGrant`;
  }
}
