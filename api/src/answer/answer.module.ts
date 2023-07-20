import { Module } from "@nestjs/common";
import { AnswerService } from "./answer.service";
import { AnswerController } from "./answer.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Answer } from "./entities/answer.entity";
import { AnswerSchema } from "./answer.schema";
import { AnswerRepository } from "./answer.repository";
import { SharedModule } from "src/shared/shared.module";
import { GranteeGrantModule } from "src/grantee-grant/grantee-grant.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Answer.name,
        schema: AnswerSchema,
      },
    ]),
    GranteeGrantModule,
    SharedModule,
  ],
  controllers: [AnswerController],
  providers: [AnswerService, AnswerRepository],
  exports: [AnswerService, AnswerRepository],
})
export class AnswerModule {}
