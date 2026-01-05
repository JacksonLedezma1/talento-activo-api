import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VacanciesService } from './vacancies.service';
import { Vacancy, Modality } from './vacancy.entity';
import { Application } from '../applications/application.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateVacancyDto } from './dto/create-vacancy.dto';
import { UpdateVacancyDto } from './dto/update-vacancy.dto';

describe('VacanciesService', () => {
  let service: VacanciesService;
  let vacanciesRepo: jest.Mocked<Repository<Vacancy>>;
  let applicationsRepo: jest.Mocked<Repository<Application>>;

  const createVacancyQueryBuilderMock = () => {
    const qb = {
      loadRelationCountAndMap: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getMany: jest.fn(),
      getOne: jest.fn(),
    };
    return qb;
  };

  const mockVacancy: Vacancy = {
    id: 1,
    title: 'NestJS Developer',
    description: 'Build APIs',
    technologies: 'NestJS, TypeScript',
    seniority: 'Senior',
    softSkills: 'Communication',
    location: 'Remote',
    modality: Modality.REMOTE,
    salaryRange: '3000-5000',
    company: 'Tech Corp',
    maxApplicants: 10,
    isActive: true,
    createdAt: new Date(),
    applications: [],
  };

  beforeEach(async () => {
    const mockVacanciesRepo = {
      create: jest.fn(),
      save: jest.fn(),
      createQueryBuilder: jest.fn(),
    };

    const mockApplicationsRepo = {
      count: jest.fn(),
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VacanciesService,
        {
          provide: getRepositoryToken(Vacancy),
          useValue: mockVacanciesRepo,
        },
        {
          provide: getRepositoryToken(Application),
          useValue: mockApplicationsRepo,
        },
      ],
    }).compile();

    service = module.get<VacanciesService>(VacanciesService);
    vacanciesRepo = module.get(getRepositoryToken(Vacancy));
    applicationsRepo = module.get(getRepositoryToken(Application));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a vacancy successfully', async () => {
      const dto: CreateVacancyDto = {
        title: 'Title',
        description: 'Desc',
        technologies: 'Tech',
        seniority: 'Sr',
        softSkills: 'Soft',
        location: 'Loc',
        modality: Modality.REMOTE,
        maxApplicants: 5,
      };

      vacanciesRepo.create.mockReturnValue(mockVacancy);
      vacanciesRepo.save.mockResolvedValue(mockVacancy);

      const result = await service.create(dto);

      expect(vacanciesRepo.create).toHaveBeenCalledWith({
        ...dto,
        isActive: true,
      });
      expect(result).toEqual(mockVacancy);
    });
  });

  describe('findAll', () => {
    it('should return all vacancies', async () => {
      const qb = createVacancyQueryBuilderMock();
      qb.getMany.mockResolvedValue([mockVacancy]);
      vacanciesRepo.createQueryBuilder.mockReturnValue(qb as any);

      const result = await service.findAll();

      expect(vacanciesRepo.createQueryBuilder).toHaveBeenCalledWith('vacancy');
      expect(qb.loadRelationCountAndMap).toHaveBeenCalledWith(
        'vacancy.applicantsCount',
        'vacancy.applications',
      );
      expect(qb.orderBy).toHaveBeenCalledWith('vacancy.createdAt', 'DESC');
      expect(result).toEqual([mockVacancy]);
    });
  });

  describe('findActive', () => {
    it('should return only active vacancies', async () => {
      const qb = createVacancyQueryBuilderMock();
      qb.getMany.mockResolvedValue([mockVacancy]);
      vacanciesRepo.createQueryBuilder.mockReturnValue(qb as any);

      const result = await service.findActive();

      expect(vacanciesRepo.createQueryBuilder).toHaveBeenCalledWith('vacancy');
      expect(qb.where).toHaveBeenCalledWith('vacancy.isActive = :isActive', {
        isActive: true,
      });
      expect(qb.orderBy).toHaveBeenCalledWith('vacancy.createdAt', 'DESC');
      expect(result).toEqual([mockVacancy]);
    });
  });

  describe('findById', () => {
    it('should return a vacancy by id', async () => {
      const qb = createVacancyQueryBuilderMock();
      qb.getOne.mockResolvedValue(mockVacancy);
      vacanciesRepo.createQueryBuilder.mockReturnValue(qb as any);

      const result = await service.findById(1);

      expect(result).toEqual(mockVacancy);
    });

    it('should throw NotFoundException if vacancy not found', async () => {
      const qb = createVacancyQueryBuilderMock();
      qb.getOne.mockResolvedValue(null);
      vacanciesRepo.createQueryBuilder.mockReturnValue(qb as any);

      await expect(service.findById(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a vacancy successfully', async () => {
      const dto: UpdateVacancyDto = { title: 'Updated' };
      const qb = createVacancyQueryBuilderMock();
      qb.getOne.mockResolvedValue(mockVacancy);
      vacanciesRepo.createQueryBuilder.mockReturnValue(qb as any);

      vacanciesRepo.save.mockResolvedValue({
        ...mockVacancy,
        title: 'Updated',
      });

      const result = await service.update(1, dto);

      expect(result.title).toBe('Updated');
    });

    it('should throw BadRequestException if maxApplicants is less than current applicants', async () => {
      const dto: UpdateVacancyDto = { maxApplicants: 2 };
      const qb = createVacancyQueryBuilderMock();
      qb.getOne.mockResolvedValue(mockVacancy);
      vacanciesRepo.createQueryBuilder.mockReturnValue(qb as any);

      applicationsRepo.count.mockResolvedValue(5);

      await expect(service.update(1, dto)).rejects.toThrow(BadRequestException);
    });
  });
});
