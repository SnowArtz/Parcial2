import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TrackEntity } from './track.entity';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { AlbumEntity } from 'src/album/album.entity';



@Injectable()
export class TracksService {
  constructor(
    @InjectRepository(TrackEntity)
    private _trackRepository: Repository<TrackEntity>,
    @InjectRepository(AlbumEntity)
    private _albumRepository: Repository<AlbumEntity>
  ) {}

    async findOne(id: string): Promise<TrackEntity> {
        const track = await this._trackRepository.findOne({ where: { id } });
        if (!track) {
        throw new BusinessLogicException('No se encontró el track con id dado', BusinessError.NOT_FOUND);
        }
        return track;
    }

    async findAll(): Promise<TrackEntity[]> {
        return await this._trackRepository.find();
    }

  async create(id: string, tracker: TrackEntity): Promise<TrackEntity> {
    const album = await this._albumRepository.findOne({where: {id}, relations: ['tracks', 'performers']});
    if (!album) {
        throw new BusinessLogicException(`No se encontró el album con id dado`, BusinessError.NOT_FOUND);
    }
    const trackCreated = this._trackRepository.create(tracker);
    if (trackCreated.duracion <= 0) {
        throw new BusinessLogicException(`La duración debe ser positiva`, BusinessError.BAD_REQUEST);
    }
    const trackSaved = await this._trackRepository.save(trackCreated);
    return trackSaved;
  }

}

