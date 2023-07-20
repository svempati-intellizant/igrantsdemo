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
import { QuestionMasterService } from "./question-master.service";
import { CreateQuestionMasterDto } from "./dto/create-question-master.dto";
import { UpdateQuestionMasterDto } from "./dto/update-question-master.dto";
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { Roles } from "src/shared/decorators/roles.decorator";
import { AuthGuard } from "@nestjs/passport";
import { ValidationPipe } from "src/shared/pipes/validator.pipe";
import { QuestionMaster } from "./entities/question-master.entity";
import { CurrentUser } from "src/shared/decorators/user.decorator";
import { User } from "src/users/entities/user.entity";
import { QuestionMasterDocument } from "./question-master.schema";
import { ObjectId } from "mongoose";

@Controller("question-master")
export class QuestionMasterController {
  constructor(private readonly questionMasterService: QuestionMasterService) {}

  @Post()
  create(@Body() createQuestionMasterDto: CreateQuestionMasterDto) {
    return this.questionMasterService.create(createQuestionMasterDto);
  }

  @Get("/:id")
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOkResponse({ description: "Creates New Grantee" })
  @ApiUnauthorizedResponse({
    description: "No / Invalid access token was passed through the header",
  })
  @ApiForbiddenResponse({
    description: "User's role doesn't enable them to access this feature",
  })
  // @Roles("MANAGER")
  // @UseGuards(AuthGuard("jwt"))
  @UsePipes(new ValidationPipe())
  async fetchQuestions(@Param("id") grantee_grant_id: ObjectId) {
    return await this.questionMasterService.fetchAllQuestions(grantee_grant_id);
  }

  @Get("")
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOkResponse({ description: "Creates New Grantee" })
  @ApiUnauthorizedResponse({
    description: "No / Invalid access token was passed through the header",
  })
  @ApiForbiddenResponse({
    description: "User's role doesn't enable them to access this feature",
  })
  // @Roles("MANAGER")
  // @UseGuards(AuthGuard("jwt"))
  async fetchAll() {
    return await this.questionMasterService.fetchAll();
  }

  @Post("questionAdd")
  postSno() {
    return this.questionMasterService.postSno();
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateQuestionMasterDto: UpdateQuestionMasterDto
  ) {
    return this.questionMasterService.update(+id, updateQuestionMasterDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.questionMasterService.remove(+id);
  }
}
