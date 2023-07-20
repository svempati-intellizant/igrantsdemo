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
  Query,
  UploadedFiles,
  UseInterceptors,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { FilesInterceptor } from "@nestjs/platform-express";
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { Roles } from "src/shared/decorators/roles.decorator";
import { ValidationPipe } from "src/shared/pipes/validator.pipe";
import { AnswerService } from "./answer.service";
import { CreateAnswerDto } from "./dto/create-answer.dto";
import { UpdateAnswerDto } from "./dto/update-answer.dto";

@Controller("answer")
export class AnswerController {
  constructor(private readonly answerService: AnswerService) {}

  @Post()
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: "Push answers submitted by Grantors",
  })
  @ApiUnauthorizedResponse({
    description: "No / Invalid access token was passed through the header",
  })
  @ApiForbiddenResponse({
    description: "User's role doesn't enable them to access this feature",
  })
  @Roles("MANAGER")
  @UseGuards(AuthGuard("jwt"))
  // @UsePipes(new ValidationPipe())
  @UseInterceptors(FilesInterceptor("files[]", 90))
  async createGrant(
    @UploadedFiles() uploads,
    @Body()
    requestBody: CreateAnswerDto
  ) {
    return await this.answerService.createAnswer(requestBody, uploads);
  }

  @Get("fetch-file")
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: "Push answers submitted by Grantors",
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
  getFileAsBuffer(@Query("file_path") file_path) {
    return this.answerService.getFileAsBuffer(file_path);
  }
}
