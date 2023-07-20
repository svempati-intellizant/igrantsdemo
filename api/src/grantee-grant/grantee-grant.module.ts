import { Module } from "@nestjs/common";
import { GranteeGrantService } from "./grantee-grant.service";
import { GranteeGrantController } from "./grantee-grant.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { GranteeGrant } from "./entities/grantee-grant.entity";
import { GranteeGrantSchema } from "./grantee-grant.schema";
import { SharedModule } from "src/shared/shared.module";
import { GranteeGrantRepository } from "./grantee-grant.repository";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: GranteeGrant.name,
        schema: GranteeGrantSchema,
      },
    ]),
    SharedModule,
  ],
  controllers: [GranteeGrantController],
  providers: [GranteeGrantService, GranteeGrantRepository],
  exports: [GranteeGrantService, GranteeGrantRepository],
})
export class GranteeGrantModule {}
