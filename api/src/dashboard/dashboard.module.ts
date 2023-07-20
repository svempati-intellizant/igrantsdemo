import { Module } from "@nestjs/common";
import { DashboardService } from "./dashboard.service";
import { SharedModule } from "src/shared/shared.module";
import { GranteeGrantModule } from "src/grantee-grant/grantee-grant.module";
import { DashboardController } from "./dashboard.controller";
import { GrantMasterModule } from "src/grant-master/grant-master.module";
import { GranteeMasterModule } from "src/grantee-master/grantee-master.module";
import { AnswerModule } from "src/answer/answer.module";

@Module({
  imports: [
    GrantMasterModule,
    GranteeMasterModule,
    GranteeGrantModule,
    AnswerModule,
    SharedModule,
  ],
  providers: [DashboardService],
  exports: [DashboardService],

  controllers: [DashboardController],
})
export class DashboardModule {}
