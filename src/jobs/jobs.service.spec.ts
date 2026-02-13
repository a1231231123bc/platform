import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
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
              update: jest.fn(),
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
  });

  describe('findOne', () => {
    it('should return a job by id', async () => {
      const job = { id: 'uuid-1', title: 'Job 1' };
      (prisma.job.findUnique as jest.Mock).mockResolvedValue(job);

      const result = await service.findOne('uuid-1');

      expect(result).toEqual(job);
    });

    it('should throw NotFoundException when job not found', async () => {
      (prisma.job.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.findOne('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateStatus', () => {
    it('should transition ACTIVE -> CLOSED', async () => {
      const job = { id: 'uuid-1', status: JobStatus.ACTIVE };
      (prisma.job.findUnique as jest.Mock).mockResolvedValue(job);
      const updated = { ...job, status: JobStatus.CLOSED };
      (prisma.job.update as jest.Mock).mockResolvedValue(updated);

      const result = await service.updateStatus('uuid-1', JobStatus.CLOSED);

      expect(prisma.job.update).toHaveBeenCalledWith({
        where: { id: 'uuid-1' },
        data: { status: JobStatus.CLOSED },
      });
      expect(result).toEqual(updated);
    });

    it('should transition DRAFT -> ACTIVE', async () => {
      const job = { id: 'uuid-1', status: JobStatus.DRAFT };
      (prisma.job.findUnique as jest.Mock).mockResolvedValue(job);
      const updated = { ...job, status: JobStatus.ACTIVE };
      (prisma.job.update as jest.Mock).mockResolvedValue(updated);

      const result = await service.updateStatus('uuid-1', JobStatus.ACTIVE);

      expect(result).toEqual(updated);
    });

    it('should reject ACTIVE -> DRAFT', async () => {
      const job = { id: 'uuid-1', status: JobStatus.ACTIVE };
      (prisma.job.findUnique as jest.Mock).mockResolvedValue(job);

      await expect(
        service.updateStatus('uuid-1', JobStatus.DRAFT),
      ).rejects.toThrow(BadRequestException);
    });

    it('should reject CLOSED -> any', async () => {
      const job = { id: 'uuid-1', status: JobStatus.CLOSED };
      (prisma.job.findUnique as jest.Mock).mockResolvedValue(job);

      await expect(
        service.updateStatus('uuid-1', JobStatus.ACTIVE),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException for missing job', async () => {
      (prisma.job.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(
        service.updateStatus('nonexistent', JobStatus.CLOSED),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
