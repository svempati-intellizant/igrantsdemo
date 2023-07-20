import { Injectable } from "@nestjs/common";
import * as _ from "lodash";
import * as moment from "moment";
import { AnswerRepository } from "src/answer/answer.repository";
import { GrantMasterRepository } from "src/grant-master/grant-master.repository";
import { GranteeGrantRepository } from "src/grantee-grant/grantee-grant.repository";
import { GranteeMasterRepository } from "src/grantee-master/grantee-master.repository";
import { GranteeMasterService } from "src/grantee-master/grantee-master.service";

@Injectable()
export class DashboardService {
  constructor(
    private readonly granteeGrantRepository: GranteeGrantRepository,
    private readonly granteeMasterRepository: GranteeMasterRepository,
    private readonly granteeMasterService: GranteeMasterService,
    private readonly grantMasterRepository: GrantMasterRepository,
    private readonly answerRepository: AnswerRepository
  ) {}

  async fetchDashboardDetails() {
    const totalGrantee = await this.granteeMasterRepository.findAll();
    const ongoingGrant = await this.granteeGrantRepository.findOngoingGrantee();
    const completedGrant = await this.granteeGrantRepository.findCompletedGrantee();
    const grantMaster = await this.grantMasterRepository.fetchAllGrant();
    const riskScoreFromAI = await this.granteeMasterService.findAllGranteeFOrAgency();
    const answerOfActivitiesUnallowed = await this.answerRepository.findAnswerForSpecificQuestion(
      "spr6"
    );

    const answerOfAllowableCostPrinciples = await this.answerRepository.findAnswerForSpecificQuestion(
      "sgr10"
    );
    const answerOfProcurmentSuspensionDebarment = await this.answerRepository.findAnswerForSpecificQuestion(
      "spr28"
    );

    const answerForProgramIncome = await this.answerRepository.findAnswerForQuestions(
      ["sffr16", "sffr17", "sffr18"]
    );

    const ongoingGrantee = ongoingGrant.length
      ? _.uniq(
          ongoingGrant.map((each_grant) => each_grant["grantee_master_id"])
        )
      : [];

    const completedGrantee = completedGrant.length
      ? _.uniq(
          completedGrant.map((each_grant) => each_grant["grantee_master_id"])
        )
      : [];

    const combinedGranteeName = [...ongoingGrantee, ...completedGrantee];

    const freshGrantee = combinedGranteeName.length
      ? totalGrantee.filter(
          ({ grantee_name: id1 }) =>
            !combinedGranteeName.some(({ grantee_name: id2 }) => id2 === id1)
        )
      : [];

    const approvedFund: any = grantMaster.length
      ? grantMaster
          .sort((a, b) => b.grant_to_date.getTime() - a.grant_to_date.getTime())
          .filter(
            (ele) =>
              ele.toObject()["disbursed_funds"] &&
              ele.toObject()["upcoming_disbursements"]
          )
          .slice(0, 10)
      : [];

    const modifiedApprovedFund = approvedFund.map((fund) => {
      return {
        ...fund.toObject(),
        total_disbursed_fund: fund
          .toObject()
          .disbursed_funds.reduce((acc, obj) => {
            acc += obj.amount;
            return acc;
          }, 0),
      };
    });

    const disbursedFund = approvedFund.length
      ? approvedFund.map((ele) => ({
          disbursed_funds: {
            grant_name: ele.toObject().grant_name,
            funds: ele.toObject()["disbursed_funds"],
          },
        }))
      : [];

    const splittedDisbursmentFund = disbursedFund.length
      ? this.splitFundForQuarters(
          disbursedFund,
          "disbursed_funds",
          "disbursed_at",
          "2020"
        )
      : [];

    const upcomingDisbursements = approvedFund.length
      ? approvedFund.map((ele) => ({
          upcoming_disbursements: {
            grant_name: ele.toObject().grant_name,
            funds: ele.toObject()["upcoming_disbursements"],
          },
        }))
      : [];

    const splittedUpcomingDisbursmentFund = upcomingDisbursements.length
      ? this.splitFundForQuarters(
          upcomingDisbursements,
          "upcoming_disbursements",
          "disbursement_at",
          "2021"
        )
      : [];

    const low = [];
    const medium = [];
    const high = [];
    riskScoreFromAI.map((ele) => {
      if (ele.risk === "low") low.push(ele);
      else if (ele.risk == "medium") medium.push(ele);
      else if (ele.risk == "high") high.push(ele);
    });

    return {
      totalGrantee: totalGrantee,
      ongoingGrantee: riskScoreFromAI.filter(
        (ele) => ele.grant_status == "ongoing"
      ),
      completedGrantee: riskScoreFromAI.filter(
        (ele) => ele.grant_status == "completed"
      ),
      freshGrantee: riskScoreFromAI.filter(
        (ele) => ele.grant_status == "fresh"
      ),
      approvedFund: approvedFund.length
        ? approvedFund.map((ele) => {
            const rawEle = ele.toObject();
            delete rawEle["disbursed_funds"];
            delete rawEle["upcoming_disbursements"];
            return rawEle;
          })
        : [],
      disbursedFund: splittedDisbursmentFund,
      upcomingDisbursements: splittedUpcomingDisbursmentFund,
      answerOfActivitiesUnallowed: answerOfActivitiesUnallowed.length
        ? answerOfActivitiesUnallowed.map((ele) => ({
            grantee_name:
              ele.grantee_grant_id["grantee_master_id"]["grantee_name"],
            value: ele.answer.value,
            amount: ele.answer.description
              ? parseInt(ele.answer.description)
              : 0,
            timestamp: ele["updatedAt"],
          }))
        : [],
      answerOfAllowableCostPrinciples: answerOfAllowableCostPrinciples.length
        ? answerOfAllowableCostPrinciples.map((ele) => ({
            grantee_name:
              ele.grantee_grant_id["grantee_master_id"]["grantee_name"],
            value: ele.answer.value,
            timestamp: ele["updatedAt"],
          }))
        : [],
      answerOfProcurmentSuspensionDebarment: answerOfProcurmentSuspensionDebarment.length
        ? answerOfAllowableCostPrinciples.map((ele) => ({
            grantee_name:
              ele.grantee_grant_id["grantee_master_id"]["grantee_name"],
            value: ele.answer.value,
            timestamp: ele["updatedAt"],
          }))
        : [],
      period_of_performance: modifiedApprovedFund,
      portfolioRisk: { low, medium, high },
      answerForProgramIncome: answerForProgramIncome.map(
        (ele) => ele.answer.value
      ),
    };
  }

  splitFundForQuarters(
    disbursement,
    keyForUpcomingOrDisbursed,
    keyForDisburse,
    yearOfDisbursment
  ) {
    const firstQuarterDisbursed = [];
    const secondQuarterDisbursed = [];
    const thirdQuarterDisbursed = [];
    const fourthQuarterDisbursed = [];
    if (disbursement.length)
      disbursement.map((each_fund) => {
        if (each_fund[keyForUpcomingOrDisbursed]["funds"].length) {
          each_fund[keyForUpcomingOrDisbursed]["funds"].map((each_date) => {
            if (
              moment(`${yearOfDisbursment}-04-01T18:30:00.000+00:00`).isAfter(
                each_date[keyForDisburse]
              )
            )
              firstQuarterDisbursed.push({
                grant_name: each_fund[keyForUpcomingOrDisbursed].grant_name,
                disbursed_at: each_date[keyForDisburse],
                amount: each_date["amount"],
              });
            else if (
              moment(`${yearOfDisbursment}-07-01T18:30:00.000+00:00`).isAfter(
                each_date[keyForDisburse]
              )
            )
              secondQuarterDisbursed.push({
                grant_name: each_fund[keyForUpcomingOrDisbursed].grant_name,
                disbursed_at: each_date[keyForDisburse],
                amount: each_date["amount"],
              });
            else if (
              moment(`${yearOfDisbursment}-10-01T18:30:00.000+00:00`).isAfter(
                each_date[keyForDisburse]
              )
            )
              thirdQuarterDisbursed.push({
                grant_name: each_fund[keyForUpcomingOrDisbursed].grant_name,
                disbursed_at: each_date[keyForDisburse],
                amount: each_date["amount"],
              });
            else if (
              moment(`${yearOfDisbursment}-12-31T18:30:00.000+00:00`).isAfter(
                each_date[keyForDisburse]
              )
            )
              fourthQuarterDisbursed.push({
                grant_name: each_fund[keyForUpcomingOrDisbursed].grant_name,
                disbursed_at: each_date[keyForDisburse],
                amount: each_date["amount"],
              });
          });
        } else {
          return;
        }
      });

    return {
      firstQuarterDisbursed,
      secondQuarterDisbursed,
      thirdQuarterDisbursed,
      fourthQuarterDisbursed,
    };
  }
}
