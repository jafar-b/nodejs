import { Test, TestingModule } from '@nestjs/testing';
import { LibraryMgtService } from './library-mgt.service';

describe('LibraryMgtService', () => {
  let service: LibraryMgtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LibraryMgtService],
    }).compile();

    service = module.get<LibraryMgtService>(LibraryMgtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
