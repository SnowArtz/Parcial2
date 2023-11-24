import { Test, TestingModule } from '@nestjs/testing';
import { PerformerAlbumService } from './performer-album.service';

describe('PerformerAlbumService', () => {
  let service: PerformerAlbumService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PerformerAlbumService],
    }).compile();

    service = module.get<PerformerAlbumService>(PerformerAlbumService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
