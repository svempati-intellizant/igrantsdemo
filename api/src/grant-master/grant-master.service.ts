import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ObjectId } from "mongoose";
import { AnswerRepository } from "src/answer/answer.repository";
import { GranteeGrantService } from "src/grantee-grant/grantee-grant.service";
import { User } from "src/users/entities/user.entity";
import {
  CreateGrantMasterDto,
  CreateGrantMasterDtoWithUserID,
} from "./dto/create-grant-master.dto";
import { UpdateGrantMasterDto } from "./dto/update-grant-master.dto";
import { GrantMasterRepository } from "./grant-master.repository";
@Injectable()
export class GrantMasterService {
  constructor(
    private readonly grantMasterRepository: GrantMasterRepository,
    private readonly granteeGrantService: GranteeGrantService,
    private readonly answerRepository: AnswerRepository
  ) {}
  async createGrant(currentUser: User, createGrant: CreateGrantMasterDto) {
    const newGrantDetails: CreateGrantMasterDtoWithUserID = {
      ...createGrant,
      grant_alloted_by: currentUser["_id"],
    };
    try {
      const grant_under_grantee = await this.grantMasterRepository.createGrant(
        newGrantDetails
      );
      const grantee_grant_record = {
        grantee_master_id: createGrant.grantee_master_id,
        grant_master_id: grant_under_grantee["id"],
      };
      return {
        ...(
          await this.granteeGrantService.create(grantee_grant_record)
        ).toObject(),
        grant_id: grant_under_grantee.grant_id,
      };
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async fetchAllGrant() {
    const all_grants = await this.grantMasterRepository.fetchAllGrant();
    const grant_under_grantee = await Promise.all(
      all_grants.map(async (grant) => {
        const grantee_related_details = await this.granteeGrantService.granteeUnderGrant(
          grant["_id"]
        );
        let risk = "";
        let riskObject = grantee_related_details.risk_score["Total Risk"];
        if (riskObject > 0 && riskObject <= process.env.LOW_RISK) risk = "low";
        else if (
          riskObject > process.env.LOW_RISK &&
          riskObject < process.env.HIGH_RISK
        )
          risk = "medium";
        else if (riskObject >= process.env.HIGH_RISK) risk = "high";
        else risk = "Not Calculated";
        var prescription = {
          "Performance Risk": [],
          "Financial Risk": [],
          "Quality Risk": [],
          "Complaince Risk": [],
        };
        if (risk != "low") {
          const answers = await this.answerRepository.fetchRespectiveAnswer(
            grantee_related_details["_id"]
          );

          answers.map((ele) => {
            if (
              ele.question_id &&
              ele.question_id.answer_impact_values.length
            ) {
              if (
                ele.question_id.answer_impact_values.find(
                  (each_answer) =>
                    each_answer.value === ele.answer.value &&
                    each_answer.prescription
                )
              ) {
                prescription[ele.question_id.risk_type].push(
                  ele.question_id.answer_impact_values.find(
                    (each_answer) =>
                      each_answer.value === ele.answer.value &&
                      each_answer.prescription
                  ).prescription
                );
              }
            }
          });
        }

        if (grantee_related_details) {
          return {
            ...grant.toObject(),
            grantee_name:
              grantee_related_details.grantee_master_id["grantee_name"],
            grantee_master_id: grantee_related_details.grantee_master_id["_id"],
            risk: risk,
            performance_risk:
              grantee_related_details["risk_score"]["Performance Risk"],
            weighted_risk:
              grantee_related_details["risk_score"]["Weighted Risk"],
            complaince_risk:
              grantee_related_details["risk_score"]["Complaince Risk"],
            quality_risk: grantee_related_details["risk_score"]["Quality Risk"],
            saf_risk: grantee_related_details["risk_score"]["SAF"],
            overall_risk: grantee_related_details["risk_score"]["Total Risk"],
            risk_analysis: grantee_related_details["risk_analysis"],
            prescription: prescription,
          };
        }
      })
    );
    return grant_under_grantee.filter((ele) => ele != null);
  }
  async pushGrantFromSAF(grant) {
    return await this.grantMasterRepository.pushGrantFromSAF(grant);
  }

  findOne(id: number) {
    return `This action returns a #${id} grantMaster`;
  }

  update(id: number, updateGrantMasterDto: UpdateGrantMasterDto) {
    return `This action updates a #${id} grantMaster`;
  }

  remove(id: number) {
    return `This action removes a #${id} grantMaster`;
  }
}
