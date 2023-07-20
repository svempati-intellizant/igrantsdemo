import { Test, TestingModule } from "@nestjs/testing";
import { GrantMasterController } from "./grant-master.controller";
import { GrantMasterService } from "./grant-master.service";

describe("GrantMasterController", () => {
  let controller: GrantMasterController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GrantMasterController],
      providers: [GrantMasterService],
    }).compile();

    controller = module.get<GrantMasterController>(GrantMasterController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
