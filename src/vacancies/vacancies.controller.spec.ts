import { Test, TestingModule } from '@nestjs/testing';
import { VacanciesController } from './vacancies.controller';
import { VacanciesService } from './vacancies.service';
import { Role } from '../users/users.entities';
import { Modality } from './vacancy.entity';
import { CreateVacancyDto } from './dto/create-vacancy.dto';

describe('VacanciesController', () => {
  let controller: VacanciesController;
  let service: jest.Mocked<VacanciesService>;

  const mockVacancy = {
    id: 1,
    title: 'NestJS Developer',
    isActive: true,
    role: Role.CODER,
  };

  beforeEach(async () => {
    const mockVacanciesService = {
      findAll: jest.fn(),
      findActive: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [VacanciesController],
      providers: [
        {
          provide: VacanciesService,
          useValue: mockVacanciesService,
        },
      ],
    }).compile();

    controller = module.get<VacanciesController>(VacanciesController);
    service = module.get(VacanciesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should call findActive for CODER role', async () => {
      const user = { role: Role.CODER };
      service.findActive.mockResolvedValue([mockVacancy as any]);

      const result = await controller.findAll(user);

      expect(service.findActive).toHaveBeenCalled();
      expect(result).toEqual([mockVacancy]);
    });

    it('should call findAll for GESTOR role', async () => {
      const user = { role: Role.GESTOR };
      service.findAll.mockResolvedValue([mockVacancy as any]);

      const result = await controller.findAll(user as any);

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual([mockVacancy]);
    });
  });

  describe('create', () => {
    it('should create a vacancy successfully', async () => {
      const dto: CreateVacancyDto = {
        title: 'New Vacancy',
        description: 'Description',
        technologies: 'NestJS',
        seniority: 'Senior',
        softSkills: 'Communication',
        location: 'Remote',
        modality: Modality.REMOTE,
        maxApplicants: 10,
      };
      service.create.mockResolvedValue(mockVacancy as any);

      const result = await controller.create(dto);

      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockVacancy);
    });

    it('should propagate errors from vacancies service', async () => {
      const dto = { title: 'New' };
      const error = new Error('Database error');
      service.create.mockRejectedValue(error);

      await expect(controller.create(dto as any)).rejects.toThrow(error);
    });
  });

  describe('update', () => {
    it('should update a vacancy successfully', async () => {
      const dto = { title: 'Updated' };
      service.update.mockResolvedValue(mockVacancy as any);

      const result = await controller.update(1, dto as any);

      expect(service.update).toHaveBeenCalledWith(1, dto);
      expect(result).toEqual(mockVacancy);
    });

    it('should propagate errors from vacancies service', async () => {
      const dto = { title: 'Updated' };
      const error = new Error('Not found');
      service.update.mockRejectedValue(error);

      await expect(controller.update(1, dto as any)).rejects.toThrow(error);
    });
  });
});
