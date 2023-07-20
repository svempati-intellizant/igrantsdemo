import { Test, TestingModule } from "@nestjs/testing";
import { GranteeGrantController } from "./grantee-grant.controller";
import { GranteeGrantService } from "./grantee-grant.service";

describe("GranteeGrantController", () => {
  let controller: GranteeGrantController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GranteeGrantController],
      providers: [GranteeGrantService],
    }).compile();

    controller = module.get<GranteeGrantController>(GranteeGrantController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
