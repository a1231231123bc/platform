import { Test, TestingModule } from '@nestjs/testing';
import { JobsService } from './jobs.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateJobDto } from './dto/create-job.dto';

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
      const expected = { id: 'uuid-1', ...dto, status: 'ACTIVE', createdAt: new Date() };
      (prisma.job.create as jest.Mock).mockResolvedValue(expected);

      const result = await service.create(dto);

      expect(prisma.job.create).toHaveBeenCalledWith({
        data: { ...dto, status: 'ACTIVE' },
      });
      expect(result).toEqual(expected);
    });

    it('should create a job with optional description', async () => {
      const dto: CreateJobDto = {
        title: 'Перевозка груза',
        description: 'Нужен грузовик 10т',
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
    it('should return jobs ordered by createdAt desc', async () => {
      const jobs = [{ id: 'uuid-1', title: 'Job 1' }];
      (prisma.job.findMany as jest.Mock).mockResolvedValue(jobs);

      const result = await service.findAll();

      expect(prisma.job.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual(jobs);
    });
  });
});
