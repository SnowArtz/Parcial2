import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrackService } from './track.service';
import { TrackEntity } from './track.entity';
import { AlbumService } from 'src/album/album.service';
import { AlbumEntity } from 'src/album/album.entity';
import { TrackController } from './track.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TrackEntity, AlbumEntity])],
  providers: [TrackService, AlbumService],
  controllers: [TrackController]
})
export class TrackModule {}
