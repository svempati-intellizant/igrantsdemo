import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Answer } from "./entities/answer.entity";
import { Model, ObjectId } from "mongoose";
import { AnswerDocument } from "./answer.schema";
import { AnswerObjectForSave, FileDetailsDTO } from "./dto/create-answer.dto";

@Injectable()
export class AnswerRepository {
  constructor(
    @InjectModel(Answer.name) private answerModel: Model<AnswerDocument>
  ) {}

  async createAnswer(answer_details: AnswerObjectForSave) {
    return await this.answerModel.findOneAndUpdate(
      {
        grantee_grant_id: answer_details.grantee_grant_id,
        question_id: answer_details.question_id,
      },
      { answer: answer_details.answer_chosen },
      { upsert: true, new: true }
    );
  }

  fetchRespectiveAnswer(grantee_grant_id: ObjectId) {
    return this.answerModel
      .find({ grantee_grant_id })
      .populate(["question_id"])
      .then((res) => res)
      .catch((err) => err);
  }

  updateAnswerForFilePath(file_path_details: FileDetailsDTO) {
    return this.answerModel.findOneAndUpdate(
      {
        _id: file_path_details.answer_id,
        "answer._id": file_path_details.answer_chosen_id,
      },
      { "answer.file_path": file_path_details.file_path },
      { upsert: true, new: true }
    );
  }

  findAnswerForSpecificQuestion(questionSno: string) {
    return this.answerModel
      .find()
      .populate({
        path: "question_id",
        select: ["questionSno"],
        match: {
          questionSno,
        },
      })
      .populate({
        path: "grantee_grant_id",
        populate: {
          path: "grantee_master_id",
        },
      })
      .then((_data) => _data.filter((_d) => _d.question_id));
  }

  findAnswerForQuestions(questionSno: string[]) {
    return this.answerModel
      .find()
      .populate({
        path: "question_id",
        select: ["questionSno"],
        match: {
          questionSno: { $in: questionSno },
        },
      })
      .populate({
        path: "grantee_grant_id",
        populate: {
          path: "grantee_master_id",
        },
      })
      .then((_data) => _data.filter((_d) => _d.question_id));
  }
}
