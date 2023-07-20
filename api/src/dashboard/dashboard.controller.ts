import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  UseGuards,
  UsePipes,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { Roles } from "src/shared/decorators/roles.decorator";
import { AuthGuard } from "@nestjs/passport";
import { ValidationPipe } from "src/shared/pipes/validator.pipe";
import { DashboardService } from "./dashboard.service";

@Controller("dashboard")
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}
  @Get("")
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: "Fetch All Grant",
  })
  @ApiUnauthorizedResponse({
    description: "No / Invalid access token was passed through the header",
  })
  @ApiForbiddenResponse({
    description: "User's role doesn't enable them to access this feature",
  })
  // @Roles("MANAGER")
  // @UseGuards(AuthGuard("jwt"))
  @UsePipes(new ValidationPipe())
  async fetchDashboardDetails() {
    return await this.dashboardService.fetchDashboardDetails();
  }
}
