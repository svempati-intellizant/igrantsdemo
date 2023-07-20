import { Test, TestingModule } from "@nestjs/testing";
import { GranteeGrantService } from "./grantee-grant.service";

describe("GranteeGrantService", () => {
  let service: GranteeGrantService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GranteeGrantService],
    }).compile();

    service = module.get<GranteeGrantService>(GranteeGrantService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
