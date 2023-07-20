import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ObjectId } from "mongoose";
import { GranteeGrantRepository } from "src/grantee-grant/grantee-grant.repository";
import { GranteeGrantService } from "src/grantee-grant/grantee-grant.service";
import * as _ from "lodash";
import { User } from "src/users/entities/user.entity";
import {
  CreateGranteeMasterDto,
  CreateGranteeMasterDtoWithUserID,
} from "./dto/create-grantee-master.dto";
import { UpdateGranteeMasterDto } from "./dto/update-grantee-master.dto";
import { GranteeMasterRepository } from "./grantee-master.repository";
import * as moment from "moment";

@Injectable()
export class GranteeMasterService {
  constructor(
    private readonly granteeMasterRepository: GranteeMasterRepository,
    private readonly granteeGrantRepository: GranteeGrantRepository
  ) {}

  createGrantee(
    currentUser: User,
    createGranteeMasterDto: CreateGranteeMasterDto
  ) {
    const newGranteeDetails: CreateGranteeMasterDtoWithUserID = {
      ...createGranteeMasterDto,
      user_id: currentUser["_id"],
    };
    return this.granteeMasterRepository.createGrantee(newGranteeDetails);
  }
  async findAll(currentUser: User) {
    const grantee_details = await this.granteeMasterRepository.findAll();
    const ongoingGrant = await this.granteeGrantRepository.findOngoingGrantee();
    const completedGrant = await this.granteeGrantRepository.findCompletedGrantee();
    const riskScoreOfAllGrantee = await this.granteeGrantRepository.findAll();

    const extractOngoingGrantee = _.uniq(
      ongoingGrant.map((each_grant) => each_grant["grantee_master_id"])
    );
    const riskOngoingGrantee = extractOngoingGrantee.map((each_grantee) => {
      const granteeWithRiskScore = ongoingGrant.filter(
        (ele) => ele["grantee_master_id"]["_id"] === each_grantee["_id"]
      )[0];

      if (granteeWithRiskScore.toObject()["risk_score"]) {
        let risk = "";
        if (
          granteeWithRiskScore.toObject()["risk_score"]["Total Risk"] > 0 &&
          granteeWithRiskScore.toObject()["risk_score"]["Total Risk"] <=
            process.env.LOW_RISK
        )
          risk = "good";
        else if (
          granteeWithRiskScore.toObject()["risk_score"]["Total Risk"] >
            process.env.LOW_RISK &&
          granteeWithRiskScore.toObject()["risk_score"]["Total Risk"] <
            process.env.HIGH_RISK
        )
          risk = "medium";
        else if (
          granteeWithRiskScore.toObject()["risk_score"]["Total Risk"] >=
          process.env.HIGH_RISK
        )
          risk = "high";
        return {
          ...granteeWithRiskScore.toObject()["grantee_master_id"],
          risk: risk,
        };
      } else
        return {
          ...granteeWithRiskScore.toObject()["grantee_master_id"],
          risk: "Not Calculated",
        };
    });
    const extractCompletedGrantee = _.uniq(
      completedGrant.map((each_grant) => each_grant["grantee_master_id"])
    );
    const riskCompletedGrantee = extractCompletedGrantee.map((ele: Object) => {
      return { ...ele, risk: "Not Calculated" };
    });
    const combinedGranteeName = [
      ...extractOngoingGrantee,
      ...extractCompletedGrantee,
    ];

    const freshGrantee = await Promise.all(
      grantee_details
        .filter(
          ({ grantee_name: id1 }) =>
            !combinedGranteeName.some(({ grantee_name: id2 }) => id2 === id1)
        )
        .map(async (each_grantee) => {
          const grantee_risk = await this.granteeGrantRepository.findSingleGranteeGrant(
            each_grantee["_id"]
          );

          const temp_grantee_risk = grantee_risk
            ? grantee_risk.toObject()
            : grantee_risk;
          if (!temp_grantee_risk)
            return { ...each_grantee.toObject(), risk: "Not Calculated" };
          else {
            let risk = "";
            if (
              temp_grantee_risk["risk_score"]["Total Risk"] > 0 &&
              temp_grantee_risk["risk_score"]["Total Risk"] <=
                process.env.LOW_RISK
            )
              risk = "good";
            else if (
              temp_grantee_risk["risk_score"]["Total Risk"] >
                process.env.LOW_RISK &&
              temp_grantee_risk["risk_score"]["Total Risk"] <
                process.env.HIGH_RISK
            )
              risk = "medium";
            else if (
              temp_grantee_risk["risk_score"]["Total Risk"] >=
              process.env.HIGH_RISK
            )
              risk = "high";
            return { ...each_grantee.toObject(), risk: risk };
          }
        })
    );

    //For Modification
    // ***********
    // const granteeWithRiskScore = {
    //   totalGrantee: [...freshGrantee, ...ongoingGrantee, ...completedGrantee],
    //   freshGrantee,
    //   ongoingGrantee,
    //   completedGrantee,
    // };
    // if (!granteeWithRiskScore.length)
    //   throw new HttpException("No grantee Found", HttpStatus.BAD_GATEWAY);
    // return granteeWithRiskScore

    // *************
    //For Modification

    if (!grantee_details.length)
      throw new HttpException("No grantee Found", HttpStatus.BAD_GATEWAY);
    return grantee_details;
  }

  async findAllGranteeFOrAgency() {
    const grantee_details = await this.granteeMasterRepository.findAll();
    const today = new Date();
    const details_of_grant = await Promise.all(
      grantee_details.map(async (each_grantee) => {
        const grantee = await this.granteeGrantRepository.findGranteeRecord(
          each_grantee.toObject()._id
        );
        if (grantee)
          return {
            ...each_grantee.toObject(),
            risk_score: grantee.toObject()["risk_score"],
            grant_status:
              moment(today).isBefore(
                grantee.toObject().grant_master_id["grant_to_date"]
              ) &&
              grantee.toObject().is_submit &&
              grantee.toObject().polled_from_ai
                ? "ongoing"
                : moment(today).isAfter(
                    grantee.toObject().grant_master_id["grant_to_date"]
                  ) &&
                  grantee.toObject().is_submit &&
                  grantee.toObject().polled_from_ai
                ? "completed"
                : "fresh",
          };
        else return { ...each_grantee.toObject(), grant_status: "fresh" };
      })
    );
    const riskGranteeDetails = details_of_grant.map((each_grantee) => {
      if (each_grantee["risk_score"]) {
        let riskObject = each_grantee["risk_score"]["Total Risk"];
        if (riskObject > 0 && riskObject <= process.env.LOW_RISK) {
          return { ...each_grantee, risk: "low" };
        } else if (
          riskObject > process.env.LOW_RISK &&
          riskObject < process.env.HIGH_RISK
        ) {
          return { ...each_grantee, risk: "medium" };
        } else if (riskObject >= process.env.HIGH_RISK) {
          return { ...each_grantee, risk: "high" };
        }
      } else {
        return { ...each_grantee, risk: "Not Calculated" };
      }
    });
    return riskGranteeDetails;
  }

  async findOne(id: ObjectId, currentUser: User) {
    const grantee_detail = await this.granteeMasterRepository.findOne(id);
    if (!grantee_detail)
      throw new HttpException("Grantee Not Found", HttpStatus.BAD_GATEWAY);
    return grantee_detail;
  }

  async pushGranteeFromSAF(grantee) {
    return await this.granteeMasterRepository.pushGranteeFromSAF(grantee);
  }

  async singleMultiGrantFetch() {
    const allGrantee = await this.findAllGranteeFOrAgency();

    return await Promise.all(
      allGrantee.map(async (each_grantee_id) => {
        const grantDetails = await this.granteeGrantRepository.findSingleMultiGrant(
          each_grantee_id._id
        );
        console.log(grantDetails);
        if (grantDetails.length > 1) {
          return {
            ...each_grantee_id,
            grant_availed: "multi",
            agency: grantDetails[0].grant_master_id["agency"]
              ? grantDetails[0].grant_master_id["agency"]
              : null,
          };
        } else if (grantDetails.length === 1) {
          return {
            ...each_grantee_id,
            grant_availed: "single",
            agency: grantDetails[0].grant_master_id["agency"]
              ? grantDetails[0].grant_master_id["agency"]
              : null,
          };
        } else {
          return { ...each_grantee_id, agency: null };
        }
      })
    );
    // return this.granteeGrantRepository.findSingleMultiGrant();
  }

  update(id: number, updateGranteeMasterDto: UpdateGranteeMasterDto) {
    return `This action updates a #${id} granteeMaster`;
  }

  remove(id: number) {
    return `This action removes a #${id} granteeMaster`;
  }
}
