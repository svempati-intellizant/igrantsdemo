import { Module } from "@nestjs/common";
import { APP_FILTER, APP_INTERCEPTOR } from "@nestjs/core";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { HttpErrorFilter } from "./shared/filters/http/http.filter";
import { HttpInterceptor } from "./shared/interceptors/http/http.interceptor";
import { LoggerInterceptor } from "./shared/interceptors/logger/logger.interceptor";
import { MongooseModule } from "@nestjs/mongoose";
import { SharedModule } from "./shared/shared.module";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { GranteeMasterModule } from "./grantee-master/grantee-master.module";
import { GrantMasterModule } from "./grant-master/grant-master.module";
import { QuestionMasterModule } from "./question-master/question-master.module";
import { GranteeGrantModule } from "./grantee-grant/grantee-grant.module";
import { AnswerModule } from "./answer/answer.module";
import { AuditModule } from "./audit/audit.module";
import { DashboardController } from "./dashboard/dashboard.controller";
import { DashboardModule } from "./dashboard/dashboard.module";

@Module({
  imports: [
    MongooseModule.forRoot(process.env.DB_URL, {
      // keepAlive: true,
      // keepAliveInitialDelay: 30000,
      useFindAndModify: false,
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
       user: process.env.DB_USERNAME,
       pass: process.env.DB_PASSWORD,
    }),
    SharedModule,
    UsersModule,
    AuthModule,
    GranteeMasterModule,
    GrantMasterModule,
    QuestionMasterModule,
    GranteeGrantModule,
    AnswerModule,
    AuditModule,
    DashboardModule,
  ],
  controllers: [AppController, DashboardController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: HttpErrorFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggerInterceptor,
    },
  ],
})
export class AppModule {}
