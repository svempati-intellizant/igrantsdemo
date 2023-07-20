import { Module } from "@nestjs/common";
import { GranteeMasterService } from "./grantee-master.service";
import { GranteeMasterController } from "./grantee-master.controller";
import { GranteeMasterRepository } from "./grantee-master.repository";
import { MongooseModule } from "@nestjs/mongoose";
import { GranteeMaster } from "./entities/grantee-master.entity";
import { GranteeMasterSchema } from "./grantee-master.schema";
import { SharedModule } from "src/shared/shared.module";
import { GranteeGrantModule } from "src/grantee-grant/grantee-grant.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: GranteeMaster.name,
        schema: GranteeMasterSchema,
      },
    ]),
    SharedModule,
    GranteeGrantModule,
  ],
  controllers: [GranteeMasterController],
  providers: [GranteeMasterService, GranteeMasterRepository],
  exports: [GranteeMasterService, GranteeMasterRepository],
})
export class GranteeMasterModule {}
