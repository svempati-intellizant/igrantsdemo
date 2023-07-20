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
  UploadedFiles,
  UseInterceptors,
  Header,
  UploadedFile,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { Roles } from "src/shared/decorators/roles.decorator";
import { AuthGuard } from "@nestjs/passport";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { AuditService } from "./audit.service";
import { CreateAuditDto } from "./dto/create-audit.dto";
import { UpdateAuditDto } from "./dto/update-audit.dto";

@Controller("audit")
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Post()
  create(@Body() createAuditDto: CreateAuditDto) {
    return this.auditService.create(createAuditDto);
  }

  @Get()
  findAll() {
    return this.auditService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.auditService.findOne(+id);
  }

  @Post("/push-dummy")
  @HttpCode(200)
  @Header("content-type", "multipart/form-data")
  @UseInterceptors(FilesInterceptor("files", 1))
  pushDummy(@UploadedFiles() json_file_upload) {
    return this.auditService.pushDummy(json_file_upload);
  }

  @Post("/audit-upload")
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: "Upload Audit File",
  })
  @ApiUnauthorizedResponse({
    description: "No / Invalid access token was passed through the header",
  })
  @ApiForbiddenResponse({
    description: "User's role doesn't enable them to access this feature",
  })
  @Roles("MANAGER")
  @UseGuards(AuthGuard("jwt"))
  @Header("content-type", "multipart/form-data")
  @UseInterceptors(FileInterceptor("file"))
  async manualUpload(@UploadedFile() uploads) {
    console.log(uploads);
    if (uploads) {
      return await this.auditService.manualUpload(uploads);
    }
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateAuditDto: UpdateAuditDto) {
    return this.auditService.update(+id, updateAuditDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.auditService.remove(+id);
  }
}
