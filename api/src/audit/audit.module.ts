import { Module } from "@nestjs/common";
import { AuditService } from "./audit.service";
import { AuditController } from "./audit.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Audit } from "./entities/audit.entity";
import { AuditSchema } from "./audit.schema";
import { SharedModule } from "src/shared/shared.module";
import { AuditRepository } from "./audit.repository";
import { GranteeMasterModule } from "src/grantee-master/grantee-master.module";
import { GrantMasterModule } from "src/grant-master/grant-master.module";
import { GranteeGrantModule } from "src/grantee-grant/grantee-grant.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Audit.name,
        schema: AuditSchema,
      },
    ]),
    SharedModule,
    GranteeMasterModule,
    GrantMasterModule,
    GranteeGrantModule,
  ],
  controllers: [AuditController],
  providers: [AuditService, AuditRepository],
})
export class AuditModule {}
