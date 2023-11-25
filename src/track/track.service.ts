import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TrackEntity } from './track.entity';
import { AlbumService } from '../album/album.service';

import {
  BusinessLogicException,
  BusinessError,
} from '../shared/errors/business-errors';

/**
 * Cree la clase correspondiente para la lógica de Track. Implemente los métodos create(albumId, track), findOne(), findAll(). Valide que la duración del track sea un numero positivo. No se puede crear un track si el álbum al que se va a asociar no existe. 
 */

@Injectable()
export class TrackService {
  constructor(
    @InjectRepository(TrackEntity)
    private readonly _trackRepository: Repository<TrackEntity>,

    private readonly _albumService: AlbumService,
  ) {}

  async create(track: TrackEntity): Promise<TrackEntity> {
    const album = await this._albumService.findOne(track.album.id);
    if (!album) {
      throw new BusinessLogicException(
        `No se puede crear un track para un álbum que no existe`,
        BusinessError.PRECONDITION_FAILED,
      );
    }
    const trackCreated = this._trackRepository.create(track);
    if (trackCreated.duracion <= 0) {
      throw new BusinessLogicException(
        `La duración del track debe ser un número positivo`,
        BusinessError.BAD_REQUEST,
      );
    }
    trackCreated.album = album;
    const trackSaved = await this._trackRepository.save(trackCreated);
    return trackSaved;
  }

  async findOne(id: string): Promise<TrackEntity> {
    const track = await this._trackRepository.findOne({
      where: { id },
      relations: ['album'],
    });
    if (!track) {
      throw new BusinessLogicException(
        `No se encontró el track con id dado`,
        BusinessError.NOT_FOUND,
      );
    }
    return track;
  }

  async findAll(): Promise<TrackEntity[]> {
    return await this._trackRepository.find({ relations: ['album'] });
  }
}
