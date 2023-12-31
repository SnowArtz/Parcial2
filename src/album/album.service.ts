import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AlbumEntity } from './album.entity';
import {
  BusinessLogicException,
  BusinessError,
} from '../shared/errors/business-errors';

/**
 * Cree la clase correspondiente para la lógica de Album. Implemente los métodos create(album), findOne(id), findAll(), delete(id). En el método crear valide que el nombre y la descripción del álbum no estén vacías. Un álbum no puede ser eliminado si tiene tracks asociados.
 */

@Injectable()
export class AlbumService {
  constructor(
    @InjectRepository(AlbumEntity)
    private readonly _albumRepository: Repository<AlbumEntity>,
  ) {}

  async create(album: AlbumEntity): Promise<AlbumEntity> {
    const albumCreated = this._albumRepository.create(album);
    if (!albumCreated.nombre || !albumCreated.descripcion) {
      throw new BusinessLogicException(
        `El nombre y la descripción del álbum no pueden estar vacíos`,
        BusinessError.BAD_REQUEST,
      );
    }
    const albumSaved = await this._albumRepository.save(albumCreated);
    return albumSaved;
  }

  async findOne(id: string): Promise<AlbumEntity> {
    const album = await this._albumRepository.findOne({
      where: { id },
      relations: ['tracks', 'performers'],
    });
    if (!album) {
      throw new BusinessLogicException(
        `No se encontró el album con id dado`,
        BusinessError.NOT_FOUND,
      );
    }
    return album;
  }

  async findAll(): Promise<AlbumEntity[]> {
    return await this._albumRepository.find({
      relations: ['tracks', 'performers'],
    });
  }

  async delete(id: string): Promise<void> {
    const albumSearched = await this._albumRepository.findOne({
      where: { id },
      relations: ['tracks', 'performers'],
    });
    if (!albumSearched) {
      throw new BusinessLogicException(
        `No se encontró el album con id dado`,
        BusinessError.NOT_FOUND,
      );
    }
    if (albumSearched.tracks.length > 0) {
      throw new BusinessLogicException(
        `El album no puede ser eliminado si tiene tracks asociados`,
        BusinessError.PRECONDITION_FAILED,
      );
    }
    await this._albumRepository.delete({ id });
  }
}
