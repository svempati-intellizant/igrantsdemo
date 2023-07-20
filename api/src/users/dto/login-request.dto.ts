import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";
import { ObjectId } from "mongoose";

/**
 * LOGIN_REQUEST
 * Received when user tries to login
 *
 * + Check for email and password
 * + Sign the JWT on success
 *
 */
export class LoginRequestDto {
  @IsString()
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsString()
  @IsEmail()
  @ApiProperty()
  password: string;
}

export interface JwtPayload {
  _id: string;
  email: string;
  role: string;
  agency: string;
}
/**
 * USER_LOGIN_SUCCESS
 * Success Response of USER LOGIN
 *
 * + Check for email and password
 * + Sign the JWT on success
 *
 */
export class UserLoginSuccessDTO {
  _id?: ObjectId;
  email: string;
  password: string;
  role: String;
  token: string;
}
