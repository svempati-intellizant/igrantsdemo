import { HttpModule, HttpService, Module } from "@nestjs/common";
import { SharedService } from "./shared.service";

@Module({
  imports: [HttpModule],
  providers: [SharedService],
  exports: [SharedService],
})
export class SharedModule {}
