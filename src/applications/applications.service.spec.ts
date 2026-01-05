import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { ApplicationsService } from './applications.service';
import { Application } from './application.entity';
import { Vacancy } from '../vacancies/vacancy.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('ApplicationsService', () => {
  let service: ApplicationsService;
  let applicationsRepo: jest.Mocked<Repository<Application>>;
  let vacanciesRepo: jest.Mocked<Repository<Vacancy>>;

  const mockVacancy = {
    id: 1,
    isActive: true,
    maxApplicants: 5,
  };

  beforeEach(async () => {
    const mockApplicationsRepo = {
      findOne: jest.fn(),
      count: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      createQueryBuilder: jest.fn(),
    };

    const mockVacanciesRepo = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApplicationsService,
        {
          provide: getRepositoryToken(Application),
          useValue: mockApplicationsRepo,
        },
        {
          provide: getRepositoryToken(Vacancy),
          useValue: mockVacanciesRepo,
        },
      ],
    }).compile();

    service = module.get<ApplicationsService>(ApplicationsService);
    applicationsRepo = module.get(getRepositoryToken(Application));
    vacanciesRepo = module.get(getRepositoryToken(Vacancy));
  });

  describe('createApplication', () => {
    const input = { userId: 1, vacancyId: 2 };

    it('should successfully create an application', async () => {
      vacanciesRepo.findOne.mockResolvedValue(mockVacancy as any);
      applicationsRepo.findOne.mockResolvedValue(null);
      applicationsRepo.count.mockResolvedValue(2);

      const mockQueryBuilder = {
        innerJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getCount: jest.fn().mockResolvedValue(1),
      };
      applicationsRepo.createQueryBuilder.mockReturnValue(
        mockQueryBuilder as any,
      );

      applicationsRepo.create.mockReturnValue({ id: 10 } as any);
      applicationsRepo.save.mockResolvedValue({ id: 10 } as any);

      const result = await service.createApplication(input);

      expect(applicationsRepo.create).toHaveBeenCalledWith({
        user: { id: input.userId },
        vacancy: { id: input.vacancyId },
      });
      expect(applicationsRepo.save).toHaveBeenCalled();
      expect(result).toEqual({ id: 10 });
    });

    it('should throw NotFoundException if vacancy does not exist', async () => {
      vacanciesRepo.findOne.mockResolvedValue(null);
      await expect(service.createApplication(input)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException if vacancy is inactive', async () => {
      vacanciesRepo.findOne.mockResolvedValue({
        ...mockVacancy,
        isActive: false,
      } as any);
      await expect(service.createApplication(input)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if already applied', async () => {
      vacanciesRepo.findOne.mockResolvedValue(mockVacancy as any);
      applicationsRepo.findOne.mockResolvedValue({ id: 1 } as any);
      await expect(service.createApplication(input)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if capacity is full', async () => {
      vacanciesRepo.findOne.mockResolvedValue(mockVacancy as any);
      applicationsRepo.findOne.mockResolvedValue(null);
      applicationsRepo.count.mockResolvedValue(5);
      await expect(service.createApplication(input)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if user has 3+ active applications', async () => {
      vacanciesRepo.findOne.mockResolvedValue(mockVacancy as any);
      applicationsRepo.findOne.mockResolvedValue(null);
      applicationsRepo.count.mockResolvedValue(0);

      const mockQueryBuilder = {
        innerJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getCount: jest.fn().mockResolvedValue(3),
      };
      applicationsRepo.createQueryBuilder.mockReturnValue(
        mockQueryBuilder as any,
      );

      await expect(service.createApplication(input)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAll', () => {
    it('should return all applications when no vacancyId is provided', async () => {
      const mockApplications = [{ id: 1 }, { id: 2 }];
      applicationsRepo.find.mockResolvedValue(mockApplications as any);

      const result = await service.findAll();

      expect(applicationsRepo.find).toHaveBeenCalledWith({
        relations: { user: true, vacancy: true },
        order: { appliedAt: 'DESC' },
      });
      expect(result).toEqual(mockApplications);
    });

    it('should return applications for a specific vacancyId', async () => {
      const mockApplications = [{ id: 1 }];
      applicationsRepo.find.mockResolvedValue(mockApplications as any);

      const result = await service.findAll({ vacancyId: 5 });

      expect(applicationsRepo.find).toHaveBeenCalledWith({
        where: { vacancy: { id: 5 } },
        relations: { user: true, vacancy: true },
        order: { appliedAt: 'DESC' },
      });
      expect(result).toEqual(mockApplications);
    });
  });
});
