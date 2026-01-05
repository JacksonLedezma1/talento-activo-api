import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationsController } from './applications.controller';
import { ApplicationsService } from './applications.service';
import { Role } from '../users/users.entities';
import { CreateApplicationDto } from './dto/create-application.dto';

describe('ApplicationsController', () => {
  let controller: ApplicationsController;
  let service: jest.Mocked<ApplicationsService>;

  beforeEach(async () => {
    const mockApplicationsService = {
      createApplication: jest.fn(),
      findAll: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApplicationsController],
      providers: [
        {
          provide: ApplicationsService,
          useValue: mockApplicationsService,
        },
      ],
    }).compile();

    controller = module.get<ApplicationsController>(ApplicationsController);
    service = module.get(ApplicationsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should successfully create an application', async () => {
      const user = { sub: 1 };
      const dto: CreateApplicationDto = { vacancyId: 2 };
      const mockResult = { id: 10, appliedAt: new Date() };
      service.createApplication.mockResolvedValue(mockResult as any);

      const result = await controller.create(user, dto);

      expect(service.createApplication).toHaveBeenCalledWith({
        userId: user.sub,
        vacancyId: dto.vacancyId,
      });
      expect(result).toEqual(mockResult);
    });

    it('should propagate errors from applications service', async () => {
      const user = { sub: 1 };
      const dto = { vacancyId: 2 };
      const error = new Error('Capacity full');
      service.createApplication.mockRejectedValue(error);

      await expect(controller.create(user, dto as any)).rejects.toThrow(error);
    });
  });

  describe('findAll', () => {
    it('should call service.findAll with parsed vacancyId', async () => {
      const mockResult = [{ id: 1 }];
      service.findAll.mockResolvedValue(mockResult as any);

      const user = { sub: 1, role: Role.GESTOR };
      const result = await controller.findAll(user as any, '5');

      expect(service.findAll).toHaveBeenCalledWith({ vacancyId: 5, userId: undefined });
      expect(result).toEqual(mockResult);
    });

    it('should call service.findAll with undefined if no vacancyId', async () => {
      service.findAll.mockResolvedValue([] as any);

      const user = { sub: 1, role: Role.CODER };
      await controller.findAll(user as any);

      expect(service.findAll).toHaveBeenCalledWith({ vacancyId: undefined, userId: 1 });
    });

    it('should propagate errors from applications service', async () => {
      const error = new Error('Database error');
      service.findAll.mockRejectedValue(error);

      const user = { sub: 1, role: Role.CODER };
      await expect(controller.findAll(user as any)).rejects.toThrow(error);
    });
  });
});
