import { Test, TestingModule } from '@nestjs/testing';
import { TaskManagerController } from './task-manager.controller';
import { TaskManagerService } from './task-manager.service';

describe('TaskManagerController', () => {
  let controller: TaskManagerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskManagerController],
      providers: [TaskManagerService],
    }).compile();

    controller = module.get<TaskManagerController>(TaskManagerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
