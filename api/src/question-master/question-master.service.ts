import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { timeStamp } from "console";
import { ObjectId } from "mongoose";
import { AnswerService } from "src/answer/answer.service";
import { CreateQuestionMasterDto } from "./dto/create-question-master.dto";
import { UpdateQuestionMasterDto } from "./dto/update-question-master.dto";
import { QuestionMasterRepository } from "./question-master.repository";

@Injectable()
export class QuestionMasterService {
  constructor(
    private readonly answerService: AnswerService,
    private readonly questionMasterRepository: QuestionMasterRepository
  ) {}

  create(createQuestionMasterDto: CreateQuestionMasterDto) {
    return "This action adds a new questionMaster";
  }

  async fetchAllQuestions(grantee_grant_id: ObjectId) {
    try {
      const alreadyAnswered = await this.answerService.fetchRespectiveAnswer(
        grantee_grant_id
      );
      console.log(grantee_grant_id);
      console.log(alreadyAnswered);
      const all_questions = await this.questionMasterRepository.fetchAllQuestions();
      console.log(alreadyAnswered);
      return all_questions.map((each_question) => {
        if (
          alreadyAnswered.filter((each_answer) =>
            each_question["_id"].equals(each_answer.question_id["_id"])
          ).length
        ) {
          return {
            ...each_question,
            answer: alreadyAnswered.filter((each_answer) =>
              each_question["_id"].equals(each_answer.question_id["_id"])
            )[0].answer,
          };
        } else {
          return each_question;
        }
      });
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async postSno() {
    const all_questions = await this.questionMasterRepository.fetchAllQuestions();
    const updatedQuestions = all_questions.map((ele) => {
      const newEle = ele;
      if (
        newEle.risk_type
          .split(" ")
          .join("")
          .toLowerCase() == "performancerisk"
      )
        return {
          ...newEle,
          questionSno: `spr${newEle.sequence_no}`,
        };
      else if (newEle.risk_type == "Financial & Fiduciary Risks") {
        newEle["risk_type"] = "Financial Risk";
        return {
          ...newEle,
          questionSno: `sffr${newEle.sequence_no}`,
        };
      } else if (
        newEle.risk_type
          .split(" ")
          .join("")
          .toLowerCase() == "qualityrisks"
      ) {
        newEle["risk_type"] = "Quality Risk";

        return {
          ...newEle,
          questionSno: `sqr${newEle.sequence_no}`,
          risk_type: "Quality Risk",
        };
      } else if (
        newEle.risk_type == "Governance, Oversight & Management Risks"
      ) {
        newEle["risk_type"] = "Complaince Risk";
        return {
          ...newEle,
          questionSno: `sgr${newEle.sequence_no}`,
        };
      }
    });

    return await Promise.all(
      updatedQuestions.map((each_question) => {
        return this.questionMasterRepository.updateQuestion(each_question);
      })
    );
  }

  async fetchAll() {
    return await this.questionMasterRepository.fetchAllQuestions();
  }
  findOne(id: number) {
    return `This action returns a #${id} questionMaster`;
  }

  update(id: number, updateQuestionMasterDto: UpdateQuestionMasterDto) {
    return `This action updates a #${id} questionMaster`;
  }

  remove(id: number) {
    return `This action removes a #${id} questionMaster`;
  }
}
