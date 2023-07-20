import { Controller, Get, HttpCode, UseGuards } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { UsersService } from "./users.service";
import { User } from "./entities/user.entity";
import { CurrentUser } from "src/shared/decorators/user.decorator";
import { AuthGuard } from "@nestjs/passport";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("me")
  @HttpCode(200)
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
  @ApiOkResponse({ description: "A JSON Object containing user information" })
  @ApiUnauthorizedResponse({
    description: "No / Invalid access token was passed through the header",
  })
  getCurrentUser(@CurrentUser() user: User): User {
    return user;
  }
}
