import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AlbumEntity } from '../album/album.entity';
import { PerformerEntity } from '../performer/performer.entity';
import { BusinessLogicException, BusinessError } from '../shared/errors/business-errors';

/**
* Cree la clase correspondiente para la asociación entre Performer y Album. Implemente el método addPerformerToAlbum(albumId, performerId) el cual agrega un performer a un álbum. Valide que tanto el performer como el álbum existen. Un álbum no puede tener más de tres performers asociados. 
*/

@Injectable()
export class AlbumPerformerService {
    constructor(
        @InjectRepository(AlbumEntity)
        private readonly albumRepository: Repository<AlbumEntity>,

        @InjectRepository(PerformerEntity)
        private readonly performerRepository: Repository<PerformerEntity>,
    ) {}

    async addPerformerToAlbum(albumId: string, performerId: string): Promise<AlbumEntity> {
        const album = await this.albumRepository.findOne({where: {id: albumId}, relations:["performers"]});
        if (!album) {
            throw new BusinessLogicException(
                `No se encontró el album con id dado`,
                BusinessError.NOT_FOUND,
            );
        }
        const performer = await this.performerRepository.findOne({where: {id: performerId}});
        if (!performer) {
            throw new BusinessLogicException(
                `No se encontró el performer con id dado`,
                BusinessError.NOT_FOUND,
            );
        }
        if ((await this.albumRepository.findOne({where: {id: albumId}, relations:["performers"]})).performers.length == 3) {
            throw new BusinessLogicException(
                `No se puede agregar más de tres performers a un álbum`,
                BusinessError.PRECONDITION_FAILED,
            );
        }
        album.performers = [...album.performers, performer];
        return await this.albumRepository.save(album);
    }
}
