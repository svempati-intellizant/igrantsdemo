import { Test, TestingModule } from '@nestjs/testing';
import { QuestionMasterController } from './question-master.controller';
import { QuestionMasterService } from './question-master.service';

describe('QuestionMasterController', () => {
  let controller: QuestionMasterController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuestionMasterController],
      providers: [QuestionMasterService],
    }).compile();

    controller = module.get<QuestionMasterController>(QuestionMasterController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
