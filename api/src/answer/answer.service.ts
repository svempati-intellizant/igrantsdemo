import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { ObjectId } from "mongoose";
import { GranteeGrantService } from "src/grantee-grant/grantee-grant.service";
import { AnswerRepository } from "./answer.repository";
import { CreateAnswerDto, FileDetailsDTO } from "./dto/create-answer.dto";
import * as path from "path";
import * as _ from "lodash";
import * as request from "request";
import * as moment from "moment";
import * as fileType from "file-type";
import {
  writeFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  createReadStream,
} from "fs";
import { GranteeGrantRepository } from "src/grantee-grant/grantee-grant.repository";
@Injectable()
export class AnswerService {
  constructor(
    private readonly granteeGrantService: GranteeGrantService,
    private readonly granteeGrantRepository: GranteeGrantRepository,

    private readonly answerRepository: AnswerRepository
  ) {}
  async createAnswer(createAnswerDto: CreateAnswerDto, uploads) {
    try {
      JSON.parse(createAnswerDto["data"]);
    } catch (error) {
      return {
        code: 400,
        message: error,
        statusmessage: "Bad Request Exception",
      };
    }
    const parsedData = JSON.parse(createAnswerDto["data"]);
    if (!parsedData.answers) {
      throw new HttpException("Bad Request", HttpStatus.BAD_REQUEST);
    }

    createAnswerDto = parsedData.answers;
    let questionAttachment = parsedData.questionAttachment;
    if (
      !parsedData.questionAttachment ||
      !parsedData.questionAttachment.length
    ) {
      questionAttachment = [];
    }

    const updatedField = await this.granteeGrantService.updateSaveOrSubmit(
      createAnswerDto.grantee_grant_id,
      createAnswerDto.is_submit
    );
    if (!updatedField)
      throw new HttpException(
        "Save Or Submit Value not updated",
        HttpStatus.INTERNAL_SERVER_ERROR
      );

    const saveAnswerRequest = await Promise.all(
      createAnswerDto.answer.map((ele) => {
        return this.answerRepository.createAnswer({
          ...ele,
          grantee_grant_id: createAnswerDto.grantee_grant_id,
        });
      })
    );
    if (
      uploads &&
      uploads.length &&
      questionAttachment &&
      questionAttachment.length
    ) {
      uploads = uploads.map((each_file) => {
        if (
          questionAttachment.filter(
            (eachQuestion) => eachQuestion.question_id == each_file.question_id
          ).length
        ) {
          return {
            ...each_file,
            question_id: questionAttachment.filter(
              (eachQuestion) =>
                eachQuestion.question_id == each_file.question_id
            )[0]["questionId"],
          };
        }
      });
    }

    if (
      uploads &&
      uploads.length &&
      questionAttachment &&
      questionAttachment.length &&
      (await saveAnswerRequest).length
    ) {
      const updatedFieldswithFilePath = await Promise.all(
        (await saveAnswerRequest).map((each_answer) => {
          const fileForQuestion = uploads.filter(
            (ele) => ele["question_id"] == each_answer.question_id
          );
          if (fileForQuestion.length) {
            let folderPath = path.join(
              process.env.ANSWER_ATTACHMENT_PATH,
              each_answer["_id"].toString(),
              each_answer.answer["_id"].toString()
            );
            if (!existsSync(folderPath))
              mkdirSync(folderPath, { recursive: true });
            writeFileSync(
              path.join(folderPath, fileForQuestion[0]["originalname"]),
              fileForQuestion[0]["buffer"],
              {
                encoding: "utf8",
              }
            );
            const file_path_details: FileDetailsDTO = {
              answer_id: each_answer["_id"],
              answer_chosen_id: each_answer.answer["_id"],
              file_path: path.join(
                each_answer["_id"].toString(),
                each_answer.answer["_id"].toString(),
                fileForQuestion[0]["originalname"]
              ),
            };
            return this.answerRepository.updateAnswerForFilePath(
              file_path_details
            );
          }
          return each_answer;
        })
      );
      if (createAnswerDto.is_submit) {
        await this.calculateRisk(createAnswerDto.grantee_grant_id);
      }
      return updatedFieldswithFilePath;
    }
    let i = 0;
    if (createAnswerDto.is_submit) {
      console.log("came", i++);
      await this.calculateRisk(createAnswerDto.grantee_grant_id);
    }
    return saveAnswerRequest;
  }
  async fetchRespectiveAnswer(grantee_grant_id: ObjectId) {
    return await this.answerRepository.fetchRespectiveAnswer(grantee_grant_id);
  }

  async getFileAsBuffer(file_path: string) {
    if (!existsSync(path.join(process.env.ANSWER_ATTACHMENT_PATH, file_path)))
      throw new HttpException("File not found", HttpStatus.NOT_FOUND);
    const buff = readFileSync(
      path.join(process.env.ANSWER_ATTACHMENT_PATH, file_path)
    );
    return {
      file_type: await fileType.fromBuffer(buff),
      file_blob: buff.toString("base64"),
    };
  }

  async calculateRisk(grantee_grant_id: ObjectId) {
    const grantee_grant_details = await this.granteeGrantRepository.findSubmittedGranteeGrant(
      grantee_grant_id
    );
    if (!grantee_grant_details) {
      return;
    }
    const grantee = grantee_grant_details.grantee_master_id;
    console.log(grantee_grant_details);
    const grant = grantee_grant_details.grant_master_id;
    const grant_id = grant.grant_id;
    const todayDate = new Date().toISOString();
    let grant_type = "";
    if (
      grant.grant_from_date &&
      grant.grant_to_date &&
      moment(todayDate).isBetween(grant.grant_from_date, grant.grant_to_date)
    ) {
      grant_type = "ongoing";
    } else if (moment(todayDate).isAfter(grant.grant_to_date)) {
      Logger.log("Risk cant be calculated for Completed Granntee");
    } else {
      grant_type = "fresh";
    }
    const question_answer = await this.answerRepository.fetchRespectiveAnswer(
      grantee_grant_id
    );

    const request_data = {
      grant_id,
      grantee_grant_id,
      type: grant_type,
      question_answer,
    };
    return await new Promise((resolve, reject) => {
      request.post(
        {
          url: process.env.RISK_API,
          body: request_data,
          json: true,
          timeout: 7200000,
        },
        (error, response, body) => {
          if (error || response.statusCode === 500) {
            if (response) reject(response.body);
          } else {
            resolve(body);
          }
        }
      );
    })
      .then((res: any) => {
        console.log(res);

        if (res.grantee_grant_id && res.risk_score && res.Weight) {
          res.risk_score["Total Risk"] = res.risk_score["Total Risk (SUM)"];
          res.risk_score["Weighted Risk"] =
            res.risk_score["Total Risk (Weighted Average)"];
          res["weightage"] = res["Weight"];
          delete res.risk_score["Total Risk (SUM)"];
          delete res.risk_score["Total Risk (Weighted Average)"];
          delete res["Weight"];

          return this.granteeGrantRepository.updateRiskScore(res);
        }
      })
      .catch((err) => console.log(err));
  }
}
