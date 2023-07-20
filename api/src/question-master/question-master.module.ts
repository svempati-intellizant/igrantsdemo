import { Module } from "@nestjs/common";
import { QuestionMasterService } from "./question-master.service";
import { QuestionMasterController } from "./question-master.controller";
import { QuestionMaster } from "./entities/question-master.entity";
import { QuestionMasterSchema } from "./question-master.schema";
import { MongooseModule } from "@nestjs/mongoose";
import { SharedModule } from "src/shared/shared.module";
import { QuestionMasterRepository } from "./question-master.repository";
import { AnswerModule } from "src/answer/answer.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: QuestionMaster.name,
        schema: QuestionMasterSchema,
      },
    ]),
    AnswerModule,
    SharedModule,
  ],
  controllers: [QuestionMasterController],
  providers: [QuestionMasterService, QuestionMasterRepository],
  exports: [QuestionMasterService],
})
export class QuestionMasterModule {}
