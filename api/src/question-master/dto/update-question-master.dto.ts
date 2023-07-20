import { PartialType } from "@nestjs/swagger";
import { CreateQuestionMasterDto } from "./create-question-master.dto";

export class UpdateQuestionMasterDto extends PartialType(
  CreateQuestionMasterDto
) {}
