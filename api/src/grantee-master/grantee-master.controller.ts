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
import { GranteeMasterService } from "./grantee-master.service";
import {
  CreateGranteeMasterDto,
  CreateGranteeSuccessResponse,
} from "./dto/create-grantee-master.dto";
import { UpdateGranteeMasterDto } from "./dto/update-grantee-master.dto";
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { Roles } from "src/shared/decorators/roles.decorator";
import { AuthGuard } from "@nestjs/passport";
import { User } from "src/users/entities/user.entity";
import { CurrentUser } from "src/shared/decorators/user.decorator";
import { ValidationPipe } from "src/shared/pipes/validator.pipe";
import { ObjectId } from "mongoose";

@Controller("grantee-master")
export class GranteeMasterController {
  constructor(private readonly granteeMasterService: GranteeMasterService) {}

  @Post("create-grantee")
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOkResponse({ description: "Creates New Grantee" })
  @ApiUnauthorizedResponse({
    description: "No / Invalid access token was passed through the header",
  })
  @ApiForbiddenResponse({
    description: "User's role doesn't enable them to access this feature",
  })
  @Roles("MANAGER")
  @UseGuards(AuthGuard("jwt"))
  @UsePipes(new ValidationPipe())
  createGrantee(
    @Body()
    requestBody: CreateGranteeMasterDto,
    @CurrentUser() currentUser: User
  ): Promise<CreateGranteeSuccessResponse> {
    return this.granteeMasterService.createGrantee(currentUser, requestBody);
  }

  @Get()
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOkResponse({ description: "Fetch All Grantee" })
  @ApiUnauthorizedResponse({
    description: "No / Invalid access token was passed through the header",
  })
  @ApiForbiddenResponse({
    description: "User's role doesn't enable them to access this feature",
  })
  @Roles("MANAGER")
  @UseGuards(AuthGuard("jwt"))
  @UsePipes(new ValidationPipe())
  async findAll(@CurrentUser() currentUser: User) {
    return await this.granteeMasterService.findAll(currentUser);
  }

  @Get("singleMultiGrant")
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOkResponse({ description: "Fetch Single Or Multi Grant" })
  @ApiUnauthorizedResponse({
    description: "No / Invalid access token was passed through the header",
  })
  @ApiForbiddenResponse({
    description: "User's role doesn't enable them to access this feature",
  })
  // @UseGuards(AuthGuard("jwt"))
  async singleMultiGrantFetch() {
    return await this.granteeMasterService.singleMultiGrantFetch();
  }

  @Get("getAgencyGranteeList")
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOkResponse({ description: "Fetch All Grantee" })
  @ApiUnauthorizedResponse({
    description: "No / Invalid access token was passed through the header",
  })
  @ApiForbiddenResponse({
    description: "User's role doesn't enable them to access this feature",
  })
  // @Roles("DATA_SPECIALIST")
  // @UseGuards(AuthGuard("jwt"))
  // @UsePipes(new ValidationPipe())
  async findAllGranteeFOrAgency(@CurrentUser() currentUser: User) {
    return await this.granteeMasterService.findAllGranteeFOrAgency();
  }

  @Get(":id")
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOkResponse({ description: "Fetch Single Grantee" })
  @ApiUnauthorizedResponse({
    description: "No / Invalid access token was passed through the header",
  })
  @ApiForbiddenResponse({
    description: "User's role doesn't enable them to access this feature",
  })
  @Roles("MANAGER")
  @UseGuards(AuthGuard("jwt"))
  @UsePipes(new ValidationPipe())
  async findOne(@CurrentUser() currentUser: User, @Param("id") id: ObjectId) {
    return await this.granteeMasterService.findOne(id, currentUser);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateGranteeMasterDto: UpdateGranteeMasterDto
  ) {
    return this.granteeMasterService.update(+id, updateGranteeMasterDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.granteeMasterService.remove(+id);
  }
}
