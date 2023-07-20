import { PartialType } from "@nestjs/swagger";
import { CreateGrantMasterDto } from "./create-grant-master.dto";

export class UpdateGrantMasterDto extends PartialType(CreateGrantMasterDto) {}
