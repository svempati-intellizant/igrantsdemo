import { Test, TestingModule } from "@nestjs/testing";
import { GrantMasterService } from "./grant-master.service";

describe("GrantMasterService", () => {
  let service: GrantMasterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GrantMasterService],
    }).compile();

    service = module.get<GrantMasterService>(GrantMasterService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
