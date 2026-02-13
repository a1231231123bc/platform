import { Test, TestingModule } from '@nestjs/testing';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { JobStatus } from '@prisma/client';

describe('JobsController', () => {
  let controller: JobsController;
  let service: JobsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JobsController],
      providers: [
        {
          provide: JobsService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            updateStatus: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<JobsController>(JobsController);
    service = module.get<JobsService>(JobsService);
  });

  describe('create', () => {
    it('should call service.create with dto', async () => {
      const dto: CreateJobDto = {
        title: 'Перевозка груза',
        region: 'Москва',
        price: 50000,
      };
      const expected = { id: 'uuid-1', ...dto, status: 'ACTIVE' };
      (service.create as jest.Mock).mockResolvedValue(expected);

      const result = await controller.create(dto);

      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expected);
    });
  });

  describe('findAll', () => {
    it('should pass filter to service', async () => {
      const filter = { status: JobStatus.ACTIVE };
      (service.findAll as jest.Mock).mockResolvedValue([]);

      await controller.findAll(filter);

      expect(service.findAll).toHaveBeenCalledWith(filter);
    });
  });

  describe('findOne', () => {
    it('should call service.findOne with id', async () => {
      const job = { id: 'uuid-1', title: 'Job 1' };
      (service.findOne as jest.Mock).mockResolvedValue(job);

      const result = await controller.findOne('uuid-1');

      expect(service.findOne).toHaveBeenCalledWith('uuid-1');
      expect(result).toEqual(job);
    });
  });

  describe('updateStatus', () => {
    it('should call service.updateStatus with id and status', async () => {
      const updated = { id: 'uuid-1', status: JobStatus.CLOSED };
      (service.updateStatus as jest.Mock).mockResolvedValue(updated);

      const result = await controller.updateStatus('uuid-1', {
        status: JobStatus.CLOSED,
      });

      expect(service.updateStatus).toHaveBeenCalledWith(
        'uuid-1',
        JobStatus.CLOSED,
      );
      expect(result).toEqual(updated);
    });
  });
});
