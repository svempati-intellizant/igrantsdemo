import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { IsObjectId } from "class-validator-mongo-object-id";
import { ObjectId } from "mongoose";

export class CreateGrantMasterDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  grant_name: string;

  @IsObjectId()
  @IsNotEmpty()
  @ApiProperty()
  grantee_master_id: ObjectId;

  @IsNotEmpty()
  @ApiProperty()
  grant_id: string;

  @IsNotEmpty()
  @ApiProperty()
  grant_authorized: number;

  @IsNotEmpty()
  @ApiProperty()
  agency: string;

  @IsNotEmpty()
  @ApiProperty()
  program: string;
}

export class CreateGrantMasterDtoWithUserID extends CreateGrantMasterDto {
  @IsObjectId()
  @IsNotEmpty()
  grant_alloted_by: ObjectId;
}
