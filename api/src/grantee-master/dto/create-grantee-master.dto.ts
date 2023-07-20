import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { IsObjectId } from "class-validator-mongo-object-id";
import { ObjectId } from "mongoose";

export class CreateGranteeMasterDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  grantee_name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  occupation: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name_of_institution: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  ein: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  address: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  contact_details: string;
}
export class CreateGranteeMasterDtoWithUserID extends CreateGranteeMasterDto {
  @IsObjectId()
  @IsNotEmpty()
  user_id: ObjectId;
}
export class CreateGranteeSuccessResponse extends CreateGranteeMasterDtoWithUserID {}
