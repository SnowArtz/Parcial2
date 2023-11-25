import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { PerformerEntity } from './performer.entity';
import { PerformerService } from './performer.service';
import { faker } from '@faker-js/faker';

describe('PerformerService', () => {
  let service: PerformerService;
  let performerRepository: Repository<PerformerEntity>;
  let performersList: PerformerEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [PerformerService],
    }).compile();

    service = module.get<PerformerService>(PerformerService);
    performerRepository = module.get<Repository<PerformerEntity>>(getRepositoryToken(PerformerEntity));

    await seedDataBase();
  });

  const seedDataBase = async () => {
    await performerRepository.clear();

    performersList = [];
    for (let i = 0; i < 5; i++) {
      const performer = await performerRepository.save({
        nombre: faker.company.name(),
        imagen: faker.image.url(),
        descripcion: faker.lorem.paragraph().slice(0, 100) // Asegurar que la descripción no exceda 100 caracteres
      });
      performersList.push(performer);
    }
  };

  // Pruebas para Create
  it('create debería retornar un nuevo performer', async () => {
    const performer: PerformerEntity = {
      id: "",
      nombre: faker.company.name(),
      imagen: faker.image.url(),
      descripcion: faker.lorem.paragraph().slice(0, 100),
      albums: []
    };

    const nuevoPerformer: PerformerEntity = await service.create(performer);
    expect(nuevoPerformer).toBeDefined();
    expect(nuevoPerformer.nombre).toEqual(performer.nombre);
    expect(nuevoPerformer.descripcion).toEqual(performer.descripcion);
  });

  it('create debería fallar si la descripción excede 100 caracteres', async () => {
    const performer: PerformerEntity = {
      id: "",
      nombre: faker.company.name(),
      imagen: faker.image.url(),
      descripcion: faker.lorem.paragraph(10),
      albums: []
    };

    await expect(service.create(performer)).rejects.toHaveProperty("message", "La descripción del performer no puede tener más de 100 caracteres");
  });

  // Pruebas para FindOne
  it('findOne debería retornar un performer por su id', async () => {
    const performer: PerformerEntity = performersList[0];
    const performerEncontrado: PerformerEntity = await service.findOne(performer.id);
    expect(performerEncontrado).toBeDefined();
    expect(performerEncontrado.id).toEqual(performer.id);
  });

  it('findOne debería lanzar una excepción para un performer inválido', async () => {
    await expect(service.findOne("0")).rejects.toHaveProperty("message", "No se encontró el performer con id dado");
  });

  // Pruebas para FindAll
  it('findAll debería retornar todos los performers', async () => {
    const performers: PerformerEntity[] = await service.findAll();
    expect(performers).toBeDefined();
    expect(performers.length).toEqual(performersList.length);
  });
});
