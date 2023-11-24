import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PerformerEntity } from './performer.entity';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';


@Injectable()
export class PerformerService {
    constructor(
        @InjectRepository(PerformerEntity)
        private readonly _performerRepository: Repository<PerformerEntity>
    ){}

    async findAll(): Promise<PerformerEntity[]> {
        return await this._performerRepository.find({relations: ['albums']});
    }

    async findOne(id: string): Promise<PerformerEntity> {
        const performer = await this._performerRepository.findOne({where: {id}, relations: ['albums']});
        if (!performer) {
            throw new BusinessLogicException(`No se encontró el performer con id dado`, BusinessError.NOT_FOUND);
        }
        return performer;
    }

    // Valide que la descripción tenga como máximo 100 caracteres
    async create(performer: PerformerEntity): Promise<PerformerEntity> {
        const performerCreated = this._performerRepository.create(performer);
        if (performerCreated.descripcion.length > 100) {
            throw new BusinessLogicException(`La descripción del performer no puede tener más de 100 caracteres`, BusinessError.BAD_REQUEST);
        }
        const performerSaved = await this._performerRepository.save(performerCreated);
        return performerSaved;
    }

    // Valide que la descripción tenga como máximo 100 caracteres
    async update(id: string, performer: PerformerEntity): Promise<PerformerEntity> {
        const performerSearched = await this._performerRepository.findOne({where: {id}, relations: ['albums']});
        if (!performerSearched) {
            throw new BusinessLogicException(`No se encontró el performer con id dado`, BusinessError.NOT_FOUND);
        }
        const performerUpdated = this._performerRepository.create(performer);
        if (performerUpdated.descripcion.length > 100) {
            throw new BusinessLogicException(`La descripción del performer no puede tener más de 100 caracteres`, BusinessError.BAD_REQUEST);
        }
        await this._performerRepository.update({id}, performerUpdated);
        const performerSaved = await this._performerRepository.findOne({where: {id}, relations: ['albums']});
        return performerSaved;
    }

    async delete(id: string): Promise<void> {
        const performerSearched = await this._performerRepository.findOne({where: {id}, relations: ['albums']});
        if (!performerSearched) {
            throw new BusinessLogicException(`No se encontró el performer con id dado`, BusinessError.NOT_FOUND);
        }
        await this._performerRepository.delete({id});
    }
}
