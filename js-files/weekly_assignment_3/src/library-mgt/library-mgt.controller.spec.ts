import { Test, TestingModule } from '@nestjs/testing';
import { LibraryMgtController } from './library-mgt.controller';
import { LibraryMgtService } from './library-mgt.service';

describe('LibraryMgtController', () => {
  let controller: LibraryMgtController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LibraryMgtController],
      providers: [LibraryMgtService],
    }).compile();

    controller = module.get<LibraryMgtController>(LibraryMgtController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
