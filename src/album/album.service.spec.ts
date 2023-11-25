import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { AlbumEntity } from './album.entity';
import { TrackEntity } from '../track/track.entity';
import { AlbumService } from './album.service';
import { faker } from '@faker-js/faker';

describe('AlbumService', () => {
  let service: AlbumService;
  let albumRepository: Repository<AlbumEntity>;
  let trackRepository: Repository<TrackEntity>;
  let albumsList: AlbumEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AlbumService],
    }).compile();

    service = module.get<AlbumService>(AlbumService);
    albumRepository = module.get<Repository<AlbumEntity>>(getRepositoryToken(AlbumEntity));
    trackRepository = module.get<Repository<TrackEntity>>(getRepositoryToken(TrackEntity));
    await seedDataBase();
  });

  const seedDataBase = async () => {
    albumRepository.clear();
    albumsList = []
    for (let i = 0; i < 5; i++) {
      const album: AlbumEntity = await albumRepository.save({
        nombre: faker.company.name(),
        caratula: faker.image.url(),
        fechaLanzamiento: faker.date.past(),
        descripcion: faker.lorem.paragraph()
      });
      albumsList.push(album);
    }
  };
  
  // Pruebas para Create
  it('crear debería retornar un nuevo álbum', async () => {
    const album: AlbumEntity = {
      id: "",
      nombre: faker.company.name(),
      caratula: faker.image.url(),
      fechaLanzamiento: faker.date.past(),
      descripcion: faker.lorem.paragraph(),
      tracks: [],
      performers: []
    }

    const nuevoAlbum: AlbumEntity = await service.create(album);
    expect(nuevoAlbum).not.toBeNull();

    const albumGuardado: AlbumEntity = await albumRepository.findOne({ where: { id: nuevoAlbum.id } });
    expect(albumGuardado).not.toBeNull();
    expect(album).not.toBeNull();
    expect(album.nombre).toEqual(albumGuardado.nombre);
    expect(album.caratula).toEqual(albumGuardado.caratula);
    expect(album.fechaLanzamiento).toEqual(albumGuardado.fechaLanzamiento);
    expect(album.descripcion).toEqual(albumGuardado.descripcion);
  });

  it('crear debería fallar si la descripción está vacía', async () => {
    const album: AlbumEntity = {
      id: "",
      nombre: faker.company.name(),
      caratula: faker.image.url(),
      fechaLanzamiento: faker.date.past(),
      descripcion: "",  // Descripción vacía
      tracks: [],
      performers: []
    };

    try {
      await service.create(album);
      fail('El servicio no falló como se esperaba');
    } catch (e) {
      expect(e.message).toEqual('El nombre y la descripción del álbum no pueden estar vacíos');
    }
  });

  // Pruebas para FindOne
  it('findOne debería retornar un álbum por su id', async () => {
    const albumGuardado: AlbumEntity = albumsList[0];
    const album: AlbumEntity = await service.findOne(albumGuardado.id);
    expect(albumGuardado).not.toBeNull();
    expect(album).not.toBeNull();
    expect(album.nombre).toEqual(albumGuardado.nombre);
    expect(album.caratula).toEqual(albumGuardado.caratula);
    expect(album.fechaLanzamiento).toEqual(albumGuardado.fechaLanzamiento);
    expect(album.descripcion).toEqual(albumGuardado.descripcion);
  });

  it('findOne debería lanzar una excepción para un álbum inválido', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "No se encontró el album con id dado")
  });

  // Pruebas para FindAll
  it('findAll debería retornar todos los álbumes', async () => {
    const albums: AlbumEntity[] = await service.findAll();
    expect(albums).not.toBeNull();
    expect(albums).toHaveLength(albumsList.length);
  });

  // Pruebas para Delete
  it('delete debería eliminar un álbum', async () => {
    const album: AlbumEntity = albumsList[0];
    await service.delete(album.id);
    const albumEliminado: AlbumEntity = await albumRepository.findOne({ where: { id: album.id } });
    expect(albumEliminado).toBeNull();
  });

  it('delete debería lanzar una excepción para un álbum inválido', async () => {
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "No se encontró el album con id dado")
  });

  it('delete no debería permitir eliminar un álbum con tracks asociados', async () => {
    // Crear un nuevo álbum
    const album: AlbumEntity = await albumRepository.save({
      nombre: faker.company.name(),
      caratula: faker.image.url(),
      fechaLanzamiento: faker.date.past(),
      descripcion: faker.lorem.paragraph(),
      tracks: []
    });

    // Crear un nuevo track y asociarlo al álbum
    const track: TrackEntity = await trackRepository.save({
      nombre: faker.lorem.word(),
      duracion: faker.number.int({ min: 120, max: 360 }), // Duración en segundos
      album: album  // Asociar este track al álbum creado
    });

    // Actualiza la lista de tracks en el álbum
    album.tracks = [track];

    // Guarda el álbum actualizado
    await albumRepository.save(album);

    // Intentar eliminar el álbum y esperar una excepción
    await expect(service.delete(album.id)).rejects.toHaveProperty("message", "El album no puede ser eliminado si tiene tracks asociados");

    // Verificar que el álbum aún existe en la base de datos
    const albumAunExiste: AlbumEntity = await albumRepository.findOne({ where: { id: album.id } });
    expect(albumAunExiste).not.toBeNull();
  });
});
