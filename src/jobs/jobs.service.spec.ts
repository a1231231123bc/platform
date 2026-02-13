import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateJobDto } from './dto/create-job.dto';
import { JobStatus } from '@prisma/client';

describe('JobsService', () => {
  let service: JobsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JobsService,
        {
          provide: PrismaService,
          useValue: {
            job: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<JobsService>(JobsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('create', () => {
    it('should create a job with ACTIVE status', async () => {
      const dto: CreateJobDto = {
        title: 'Перевозка груза',
        region: 'Москва',
        price: 50000,
      };
      const expected = { id: 'uuid-1', ...dto, status: 'ACTIVE' };
      (prisma.job.create as jest.Mock).mockResolvedValue(expected);

      const result = await service.create(dto);

      expect(prisma.job.create).toHaveBeenCalledWith({
        data: { ...dto, status: 'ACTIVE' },
      });
      expect(result).toEqual(expected);
    });
  });

  describe('findAll', () => {
    it('should return all jobs when no filter', async () => {
      const jobs = [{ id: 'uuid-1', title: 'Job 1' }];
      (prisma.job.findMany as jest.Mock).mockResolvedValue(jobs);

      const result = await service.findAll({});

      expect(prisma.job.findMany).toHaveBeenCalledWith({
        where: {},
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual(jobs);
    });

    it('should filter by status', async () => {
      (prisma.job.findMany as jest.Mock).mockResolvedValue([]);

      await service.findAll({ status: JobStatus.ACTIVE });

      expect(prisma.job.findMany).toHaveBeenCalledWith({
        where: { status: JobStatus.ACTIVE },
        orderBy: { createdAt: 'desc' },
      });
    });

    it('should filter by region', async () => {
      (prisma.job.findMany as jest.Mock).mockResolvedValue([]);

      await service.findAll({ region: 'Москва' });

      expect(prisma.job.findMany).toHaveBeenCalledWith({
        where: { region: 'Москва' },
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('findOne', () => {
    it('should return a job by id', async () => {
      const job = { id: 'uuid-1', title: 'Job 1' };
      (prisma.job.findUnique as jest.Mock).mockResolvedValue(job);

      const result = await service.findOne('uuid-1');

      expect(prisma.job.findUnique).toHaveBeenCalledWith({
        where: { id: 'uuid-1' },
      });
      expect(result).toEqual(job);
    });

    it('should throw NotFoundException when job not found', async () => {
      (prisma.job.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.findOne('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
