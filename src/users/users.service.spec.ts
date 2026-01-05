import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UsersService } from './users.service';
import { User, Role } from './users.entities';

jest.mock('bcrypt');

describe('UsersService', () => {
  let service: UsersService;
  let repository: jest.Mocked<Repository<User>>;

  const mockUser: User = {
    id: 1,
    name: 'Test User',
    email: 'test@example.com',
    password: 'hashedPassword123',
    role: Role.CODER,
    isActive: true,
    createdAt: new Date(),
    applications: [],
  };

  const mockUsers: User[] = [
    mockUser,
    {
      id: 2,
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'hashedPassword456',
      role: Role.ADMIN,
      isActive: true,
      createdAt: new Date(),
      applications: [],
    },
  ];

  beforeEach(async () => {
    const mockRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      createQueryBuilder: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users without password field', async () => {
      repository.find.mockResolvedValue(mockUsers);

      const result = await service.findAll();

      expect(repository.find).toHaveBeenCalledWith({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          isActive: true,
          createdAt: true,
        },
      });
      expect(result).toEqual(mockUsers);
    });

    it('should return empty array if no users exist', async () => {
      repository.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findByEmail', () => {
    it('should return a user by email', async () => {
      repository.findOne.mockResolvedValue(mockUser);

      const result = await service.findByEmail('test@example.com');

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
      expect(result).toEqual(mockUser);
    });

    it('should return null if user not found', async () => {
      repository.findOne.mockResolvedValue(null);

      const result = await service.findByEmail('nonexistent@example.com');

      expect(result).toBeNull();
    });
  });

  describe('findByEmailWithPassword', () => {
    it('should return a user with password field', async () => {
      const mockQueryBuilder = {
        addSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockUser),
      } as unknown as SelectQueryBuilder<User>;

      repository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.findByEmailWithPassword('test@example.com');

      expect(repository.createQueryBuilder).toHaveBeenCalledWith('user');
      expect(mockQueryBuilder.addSelect).toHaveBeenCalledWith('user.password');
      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'user.email = :email',
        { email: 'test@example.com' },
      );
      expect(result).toEqual(mockUser);
    });

    it('should return null if user not found', async () => {
      const mockQueryBuilder = {
        addSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      } as unknown as SelectQueryBuilder<User>;

      repository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.findByEmailWithPassword(
        'nonexistent@example.com',
      );

      expect(result).toBeNull();
    });
  });

  describe('createUser', () => {
    it('should create a new user with hashed password', async () => {
      const createUserDto = {
        name: 'New User',
        email: 'new@example.com',
        password: 'Password123!',
      };

      const hashedPassword = 'hashedPassword789';
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

      const createdUser = {
        ...mockUser,
        id: 3,
        name: createUserDto.name,
        email: createUserDto.email,
        password: hashedPassword,
      };

      repository.create.mockReturnValue(createdUser);
      repository.save.mockResolvedValue(createdUser);

      const result = await service.createUser(createUserDto);

      expect(bcrypt.hash).toHaveBeenCalledWith(createUserDto.password, 10);
      expect(repository.create).toHaveBeenCalledWith({
        name: createUserDto.name,
        email: createUserDto.email,
        password: hashedPassword,
      });
      expect(repository.save).toHaveBeenCalledWith(createdUser);
      expect(result).not.toHaveProperty('password');
      expect(result).toEqual(
        expect.objectContaining({
          id: 3,
          name: createUserDto.name,
          email: createUserDto.email,
        }),
      );
    });

    it('should remove password from returned user object', async () => {
      const createUserDto = {
        name: 'Test',
        email: 'test@test.com',
        password: 'pass123',
      };

      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');
      repository.create.mockReturnValue(mockUser);
      repository.save.mockResolvedValue(mockUser);

      const result = await service.createUser(createUserDto);

      expect(result).not.toHaveProperty('password');
    });
  });
});
