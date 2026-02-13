import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              create: jest.fn(),
              findUnique: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('register', () => {
    it('should create a user and return without password', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');
      const user = {
        id: 'uuid-1',
        email: 'test@test.com',
        password: 'hashed-password',
        name: 'Test',
        createdAt: new Date(),
      };
      (prisma.user.create as jest.Mock).mockResolvedValue(user);

      const result = await service.register({
        email: 'test@test.com',
        password: '123456',
        name: 'Test',
      });

      expect(result).not.toHaveProperty('password');
      expect(result.email).toBe('test@test.com');
      expect(bcrypt.hash).toHaveBeenCalledWith('123456', 10);
    });

    it('should throw ConflictException if email exists', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: 'uuid-1' });

      await expect(
        service.register({
          email: 'test@test.com',
          password: '123456',
          name: 'Test',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('validateUser', () => {
    it('should return user without password on valid credentials', async () => {
      const user = {
        id: 'uuid-1',
        email: 'test@test.com',
        password: 'hashed',
        name: 'Test',
        createdAt: new Date(),
      };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.validateUser('test@test.com', '123456');

      expect(result).not.toHaveProperty('password');
      expect(result.email).toBe('test@test.com');
    });

    it('should throw UnauthorizedException if user not found', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(
        service.validateUser('wrong@test.com', '123456'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password is wrong', async () => {
      const user = {
        id: 'uuid-1',
        email: 'test@test.com',
        password: 'hashed',
        name: 'Test',
      };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.validateUser('test@test.com', 'wrong'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('findById', () => {
    it('should return user without password', async () => {
      const user = {
        id: 'uuid-1',
        email: 'test@test.com',
        password: 'hashed',
        name: 'Test',
        createdAt: new Date(),
      };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(user);

      const result = await service.findById('uuid-1');

      expect(result).not.toHaveProperty('password');
    });

    it('should return null if user not found', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await service.findById('nonexistent');

      expect(result).toBeNull();
    });
  });
});
