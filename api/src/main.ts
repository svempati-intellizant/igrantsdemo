import { Logger } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as bodyParser from "body-parser";
import { config } from "dotenv";
import * as fs from "fs";
import { setUpDataBase } from "./db";
function setupServer() {
  const port = parseInt(process.env.PORT, 10) || 6338;
  const host = process.env.HOST || "0.0.0.0";
  const globalPrefix = process.env.GLOBAL_PREFIX || "api/v1";
  return { port, host, globalPrefix };
}

async function bootstrap() {
  config();
  console.log(process.env.DB_URL);
  // await setUpDataBase();
  const { NestFactory } = await import("@nestjs/core");
  const { AppModule } = await import("./app.module");
  const app = await NestFactory.create(AppModule);
  const { port, host, globalPrefix } = setupServer();

  // To push data upto 50mb
  app.use(bodyParser.json({ limit: "100mb" }));
  app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));

  // Enable CORS to avoisd Cross origin Problems
  app.enableCors();

  //By setting the global prefix app will defaulty have an endpoint
  app.setGlobalPrefix(globalPrefix);

  //Swagger Options for creating the API documentations
  const options = new DocumentBuilder()
    .setTitle("iGrant POC")
    .setDescription("iGrant API Documentation")
    .setVersion("1.0")
    .addBearerAuth(
      { type: "http", scheme: "bearer", bearerFormat: "Token" },
      "access-token"
    )
    .build();

  //Create the Swagger document and save it in local
  const document = SwaggerModule.createDocument(app, options);
  fs.writeFileSync(
    process.env.SWAGGER_PATH + "/swagger-spec.json",
    JSON.stringify(document)
  );

  //Endpoint to view swagger documentation
  SwaggerModule.setup("api-docs", app, document);
  await app.listen(port, host, () => {
    Logger.log(`Nest App listening at http://${host}:${port}/${globalPrefix}`);
  });
}
bootstrap();
