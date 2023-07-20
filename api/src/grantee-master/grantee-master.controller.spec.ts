import { Test, TestingModule } from '@nestjs/testing';
import { GranteeMasterController } from './grantee-master.controller';
import { GranteeMasterService } from './grantee-master.service';

describe('GranteeMasterController', () => {
  let controller: GranteeMasterController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GranteeMasterController],
      providers: [GranteeMasterService],
    }).compile();

    controller = module.get<GranteeMasterController>(GranteeMasterController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
