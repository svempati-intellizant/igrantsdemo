import { Module } from "@nestjs/common";
import { GrantMasterService } from "./grant-master.service";
import { GrantMasterController } from "./grant-master.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { GrantMaster } from "./entities/grant-master.entity";
import { SharedModule } from "src/shared/shared.module";
import { GrantMasterSchema } from "./grant-master.schema";
import { GrantMasterRepository } from "./grant-master.repository";
import { GranteeGrantModule } from "src/grantee-grant/grantee-grant.module";
import { AnswerModule } from "src/answer/answer.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: GrantMaster.name,
        schema: GrantMasterSchema,
      },
    ]),
    SharedModule,
    GranteeGrantModule,
    AnswerModule,
  ],
  controllers: [GrantMasterController],
  providers: [GrantMasterService, GrantMasterRepository],
  exports: [GrantMasterService, GrantMasterRepository],
})
export class GrantMasterModule {}
