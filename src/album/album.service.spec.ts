import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { AlbumEntity } from './album.entity';
import { AlbumService } from './album.service';

import { faker } from '@faker-js/faker';

describe('AlbumService', () => {
 let service: AlbumService;
 let repository: Repository<AlbumEntity>;
 let albumsList: AlbumEntity[];

 beforeEach(async () => {
   const module: TestingModule = await Test.createTestingModule({
     imports: [...TypeOrmTestingConfig()],
     providers: [AlbumService],
   }).compile();

   service = module.get<AlbumService>(AlbumService);
   repository = module.get<Repository<AlbumEntity>>(getRepositoryToken(AlbumEntity));
   await seedDataBase();
 });

 const seedDataBase = async () => {
  repository.clear();
  albumsList = []
  for (let i = 0; i < 5; i++) {
    const album: AlbumEntity = await repository.save({
      nombre: faker.company.name(),
      caratula: faker.lorem.paragraph(),
      fecha: faker.date.past(),
      descripcion: faker.lorem.paragraph()
    });
    albumsList.push(album);
  }
};
  
 it('should be defined', () => {
   expect(service).toBeDefined();
 });

 it('create should return a new album', async () => {
  const album: AlbumEntity = {
    id: "",
    nombre: faker.company.name(),
    caratula: faker.lorem.paragraph(),
    fecha: faker.date.past(),
    descripcion: faker.lorem.paragraph(),
    tracks: [],
    performers: []
  }

  const newAlbum: AlbumEntity = await service.create(album);
  expect(newAlbum).not.toBeNull();

  const storedAlbum: AlbumEntity = await repository.findOne({where: {id: newAlbum.id}})
  expect(storedAlbum).not.toBeNull();
  expect(album).not.toBeNull();
  expect(album.nombre).toEqual(storedAlbum.nombre);
  expect(album.caratula).toEqual(storedAlbum.caratula);
  expect(album.fecha).toEqual(storedAlbum.fecha);
  expect(album.descripcion).toEqual(storedAlbum.descripcion);

});

it('create should throw an exception for an invalid album', async () => {
  const album: AlbumEntity = {
    id: "",
    nombre: faker.company.name(),
    caratula: faker.lorem.paragraph(),
    fecha: faker.date.past(),
    descripcion: "",
    tracks: [],
    performers: []
  }
  const newAlbum: AlbumEntity = await service.create(album);
});

});