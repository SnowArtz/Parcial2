import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { AlbumEntity } from '../album/album.entity';
import { PerformerEntity } from '../performer/performer.entity';
import { AlbumPerformerService } from './album-performer.service';
import { faker } from '@faker-js/faker';
import { PerformerService } from '../performer/performer.service';
import { AlbumService } from '../album/album.service';

describe('AlbumPerformerService', () => {
  let service: AlbumPerformerService;
  let albumRepository: Repository<AlbumEntity>;
  let performerRepository: Repository<PerformerEntity>;
  let album: AlbumEntity;
  let performers: PerformerEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AlbumPerformerService, AlbumService, PerformerService],
    }).compile();

    service = module.get<AlbumPerformerService>(AlbumPerformerService);
    albumRepository = module.get<Repository<AlbumEntity>>(getRepositoryToken(AlbumEntity));
    performerRepository = module.get<Repository<PerformerEntity>>(getRepositoryToken(PerformerEntity));

    await seedDataBase();
  });

  const seedDataBase = async () => {
    await albumRepository.clear();
    await performerRepository.clear();

    album = await albumRepository.save({
      nombre: faker.company.name(),
      caratula: faker.image.url(),
      fechaLanzamiento: faker.date.past(),
      descripcion: faker.lorem.paragraph(),
      tracks: [],
      performers: []
    });

    performers = [];
    for (let i = 0; i < 5; i++) {
      const performer = await performerRepository.save({
        nombre: faker.company.name(),
        descripcion: faker.lorem.paragraph().slice(0, 100),
        imagen: faker.image.url(),
        albums: []
      });
      performers.push(performer);
    }
  };

  // Pruebas para addPerformerToAlbum
  it('debería agregar exitosamente un performer a un álbum', async () => {
    const albumModificado = await service.addPerformerToAlbum(album.id, performers[0].id);
    expect(albumModificado.performers).toContainEqual(expect.objectContaining({ id: performers[0].id }));
  });

  it('debería fallar al intentar agregar un performer a un álbum que no existe', async () => {
    await expect(service.addPerformerToAlbum("id_inexistente", performers[0].id)).rejects.toHaveProperty("message", "No se encontró el album con id dado");
  });

  it('debería fallar al intentar agregar un performer que no existe a un álbum', async () => {
    await expect(service.addPerformerToAlbum(album.id, "id_inexistente")).rejects.toHaveProperty("message", "No se encontró el performer con id dado");
  });

  it('debería fallar al intentar agregar un performer a un álbum con tres o más performers', async () => {
    // Primero agregamos tres performers al álbum
    for (let i = 0; i < 3; i++) {
      await service.addPerformerToAlbum(album.id, performers[i].id);
    }
    // Intentamos agregar un cuarto performer
    await expect(service.addPerformerToAlbum(album.id, performers[3].id)).rejects.toHaveProperty("message", "No se puede agregar más de tres performers a un álbum");
  });
});
