import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { TrackEntity } from './track.entity';
import { AlbumEntity } from '../album/album.entity';
import { TrackService } from './track.service';
import { AlbumService } from '../album/album.service';
import { faker } from '@faker-js/faker';

describe('TrackService', () => {
  let service: TrackService;
  let trackRepository: Repository<TrackEntity>;
  let albumRepository: Repository<AlbumEntity>;
  let album: AlbumEntity;
  let tracksList: TrackEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [TrackService, AlbumService],
    }).compile();

    service = module.get<TrackService>(TrackService);
    trackRepository = module.get<Repository<TrackEntity>>(getRepositoryToken(TrackEntity));
    albumRepository = module.get<Repository<AlbumEntity>>(getRepositoryToken(AlbumEntity));

    await seedDataBase();
  });

  const seedDataBase = async () => {
    await trackRepository.clear();
    await albumRepository.clear();

    album = await albumRepository.save({
      nombre: faker.company.name(),
      caratula: faker.image.url(),
      fechaLanzamiento: faker.date.past(),
      descripcion: faker.lorem.paragraph(),
      tracks: []
    });

    tracksList = [];
    for (let i = 0; i < 5; i++) {
      const track = await trackRepository.save({
        nombre: faker.lorem.word(),
        duracion: faker.number.int({ min: 120, max: 360 }),
        album: album
      });
      tracksList.push(track);
    }
  };

  // Pruebas para Create
  it('create debería retornar un nuevo track', async () => {
    const track: TrackEntity = {
      id: "",
      nombre: faker.lorem.word(),
      duracion: faker.number.int({ min: 120, max: 360 }),
      album: album
    };

    const nuevoTrack: TrackEntity = await service.create(track);
    expect(nuevoTrack).toBeDefined();
    expect(nuevoTrack.nombre).toEqual(track.nombre);
    expect(nuevoTrack.duracion).toEqual(track.duracion);
  });

  it('create debería fallar si la duración es negativa', async () => {
    const track: TrackEntity = {
      id: "",
      nombre: faker.lorem.word(),
      duracion: -faker.number.int({ min: 1 }),
      album: album
    };

    await expect(service.create(track)).rejects.toHaveProperty("message", "La duración del track debe ser un número positivo");
  });

  it('create debería fallar si el álbum asociado no existe', async () => {
    const track: TrackEntity = {
      id: "",
      nombre: faker.lorem.word(),
      duracion: faker.number.int({ min: 120, max: 360 }),
      album: { id: "id_inexistente" } as AlbumEntity
    };

    await expect(service.create(track)).rejects.toHaveProperty("message", "No se encontró el album con id dado");
  });

  // Pruebas para FindOne
  it('findOne debería retornar un track por su id', async () => {
    const track: TrackEntity = tracksList[0];
    const trackEncontrado: TrackEntity = await service.findOne(track.id);
    expect(trackEncontrado).toBeDefined();
    expect(trackEncontrado.id).toEqual(track.id);
  });

  it('findOne debería lanzar una excepción para un track inválido', async () => {
    await expect(service.findOne("0")).rejects.toHaveProperty("message", "No se encontró el track con id dado");
  });

  // Pruebas para FindAll
  it('findAll debería retornar todos los tracks', async () => {
    const tracks: TrackEntity[] = await service.findAll();
    expect(tracks).toBeDefined();
    expect(tracks.length).toEqual(tracksList.length);
  });
});
