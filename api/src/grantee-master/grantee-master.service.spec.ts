import { Test, TestingModule } from '@nestjs/testing';
import { GranteeMasterService } from './grantee-master.service';

describe('GranteeMasterService', () => {
  let service: GranteeMasterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GranteeMasterService],
    }).compile();

    service = module.get<GranteeMasterService>(GranteeMasterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
