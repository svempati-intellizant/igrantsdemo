import { Test, TestingModule } from '@nestjs/testing';
import { QuestionMasterService } from './question-master.service';

describe('QuestionMasterService', () => {
  let service: QuestionMasterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuestionMasterService],
    }).compile();

    service = module.get<QuestionMasterService>(QuestionMasterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
