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
import { GrantMasterService } from "./grant-master.service";
import { CreateGrantMasterDto } from "./dto/create-grant-master.dto";
import { UpdateGrantMasterDto } from "./dto/update-grant-master.dto";
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { Roles } from "src/shared/decorators/roles.decorator";
import { AuthGuard } from "@nestjs/passport";
import { ValidationPipe } from "src/shared/pipes/validator.pipe";
import { User } from "src/users/entities/user.entity";
import { CurrentUser } from "src/shared/decorators/user.decorator";
import { CreateGranteeGrantDto } from "src/grantee-grant/dto/create-grantee-grant.dto";
import { ObjectId } from "mongoose";

@Controller("grant-master")
export class GrantMasterController {
  constructor(private readonly grantMasterService: GrantMasterService) {}
  @Post("create-grant")
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: "Creates New Grant ",
  })
  @ApiUnauthorizedResponse({
    description: "No / Invalid access token was passed through the header",
  })
  @ApiForbiddenResponse({
    description: "User's role doesn't enable them to access this feature",
  })
  @Roles("MANAGER")
  @UseGuards(AuthGuard("jwt"))
  @UsePipes(new ValidationPipe())
  async createGrant(
    @Body()
    requestBody: CreateGrantMasterDto,
    @CurrentUser() currentUser: User
  ): Promise<CreateGranteeGrantDto> {
    return await this.grantMasterService.createGrant(currentUser, requestBody);
  }

  @Get("get-all-grant")
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
  // @UsePipes(new ValidationPipe())
  async fetchAllGrant() {
    return await this.grantMasterService.fetchAllGrant();
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateGrantMasterDto: UpdateGrantMasterDto
  ) {
    return this.grantMasterService.update(+id, updateGrantMasterDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.grantMasterService.remove(+id);
  }
}
