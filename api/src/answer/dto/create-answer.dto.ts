import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsString } from "class-validator";
import { IsObjectId } from "class-validator-mongo-object-id";
import { ObjectId } from "mongoose";

export class AnswerChosenDto {
  value: string;
  weightage: number;
  description: string;
  file_path: string;
}
export class AnswerDto {
  question_id: ObjectId;
  answer_chosen: AnswerChosenDto;
}
export class AnswerObjectForSave extends AnswerDto {
  grantee_grant_id: ObjectId;
}
export class CreateAnswerDto {
  @IsObjectId()
  @IsNotEmpty()
  @ApiProperty()
  grantee_grant_id: ObjectId;

  @IsNotEmpty()
  @ApiProperty()
  answer: AnswerDto[];

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty()
  is_submit: boolean;
}

export class FileDetailsDTO {
  answer_id: ObjectId;
  answer_chosen_id: ObjectId;
  file_path: string;
}
