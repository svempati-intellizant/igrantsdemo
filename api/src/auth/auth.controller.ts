import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import {
  LoginRequestDto,
  UserLoginSuccessDTO,
} from "src/users/dto/login-request.dto";

import {
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
} from "@nestjs/swagger";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("login")
  @HttpCode(200)
  @ApiOkResponse({ description: "User successfully logged in" })
  @ApiUnauthorizedResponse({ description: "Invalid Credentials" })
  @ApiBadRequestResponse({ description: "Bad Request Body" })
  login(@Body() loginDto: LoginRequestDto): Promise<UserLoginSuccessDTO> {
    return this.authService.login(loginDto);
  }
}
