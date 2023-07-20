import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { QuestionMaster } from "./entities/question-master.entity";
import { QuestionMasterDocument } from "./question-master.schema";

@Injectable()
export class QuestionMasterRepository {
  constructor(
    @InjectModel(QuestionMaster.name)
    private questionMasterModel: Model<QuestionMasterDocument>
  ) {}

  fetchAllQuestions() {
    return this.questionMasterModel.find().lean();
  }

  updateQuestion(each_question) {
    console.log(each_question);
    return this.questionMasterModel.findOneAndUpdate(
      { _id: each_question._id },
      {
        risk_type: each_question.risk_type,
        questionSno: each_question.questionSno,
      },
      {
        upsert: true,
        new: true,
      }
    );
  }
}
