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
import { GranteeGrantService } from "./grantee-grant.service";
import { CreateGranteeGrantDto } from "./dto/create-grantee-grant.dto";
import { UpdateGranteeGrantDto } from "./dto/update-grantee-grant.dto";
import { RenewGrantDTO } from "./dto/renew-grantee-grant.dto";
import { ObjectId } from "mongoose";

@Controller("grantee-grant")
export class GranteeGrantController {
  constructor(private readonly granteeGrantService: GranteeGrantService) {}

  @Post()
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: "Fetch Grant Details ",
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
  create(@Body() createGranteeGrantDto: CreateGranteeGrantDto) {
    return this.granteeGrantService.create(createGranteeGrantDto);
  }

  @Post("renew-grant")
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: "Fetch Grant Details ",
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
  async renewGrant(@Body() renewGrant: RenewGrantDTO) {
    return await this.granteeGrantService.renewGrant(renewGrant);
  }

  @Get()
  async findAll() {
    return await this.granteeGrantService.findAll();
  }

  @Get(":id")
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: "Fetch Grant Details ",
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
  async findGrantsForRespectiveGrant(@Param("id") id: ObjectId) {
    return await this.granteeGrantService.findGrantsForRespectiveGrant(id);
  }

  @Get("risk_analysis/:id")
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: "Fetch Grant Details ",
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
  async findRiskForGrant(@Param("id") id: ObjectId) {
    return await this.granteeGrantService.findRiskForGrant(id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateGranteeGrantDto: UpdateGranteeGrantDto
  ) {
    return this.granteeGrantService.update(+id, updateGranteeGrantDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.granteeGrantService.remove(+id);
  }
}
