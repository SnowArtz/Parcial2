import { Module } from '@nestjs/common';
import { PerformerAlbumService } from './performer-album.service';
import { AlbumEntity } from 'src/album/album.entity';
import { PerformerEntity } from 'src/performer/performer.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  providers: [PerformerAlbumService],
  imports: [TypeOrmModule.forFeature([AlbumEntity, PerformerEntity])],

})
export class PerformerAlbumModule {}
