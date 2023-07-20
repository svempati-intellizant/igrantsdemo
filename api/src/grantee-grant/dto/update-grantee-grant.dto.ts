import { PartialType } from "@nestjs/swagger";
import { CreateGranteeGrantDto } from "./create-grantee-grant.dto";

export class UpdateGranteeGrantDto extends PartialType(CreateGranteeGrantDto) {}
