import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PerformerEntity } from './performer.entity';
import {
  BusinessLogicException,
  BusinessError,
} from '../shared/errors/business-errors';

/**
 * Cree la clase correspondiente para la lógica de Performer. Implemente los métodos create(performer), findOne(id), findAll(). Valide que la descripción tenga como máximo 100 caracteres.
 * **/

@Injectable()
export class PerformerService {
  constructor(
    @InjectRepository(PerformerEntity)
    private readonly _performerRepository: Repository<PerformerEntity>,
  ) {}

  async create(performer: PerformerEntity): Promise<PerformerEntity> {
    const performerCreated = this._performerRepository.create(performer);
    if (performerCreated.descripcion.length > 100) {
      throw new BusinessLogicException(
        `La descripción del performer no puede tener más de 100 caracteres`,
        BusinessError.BAD_REQUEST,
      );
    }
    const performerSaved =
      await this._performerRepository.save(performerCreated);
    return performerSaved;
  }

  async findOne(id: string): Promise<PerformerEntity> {
    const performer = await this._performerRepository.findOne({
      where: { id },
      relations: ['albums'],
    });
    if (!performer) {
      throw new BusinessLogicException(
        `No se encontró el performer con id dado`,
        BusinessError.NOT_FOUND,
      );
    }
    return performer;
  }

  async findAll(): Promise<PerformerEntity[]> {
    return await this._performerRepository.find({ relations: ['albums'] });
  }
}
