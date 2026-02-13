import { Test, TestingModule } from '@nestjs/testing';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';

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
    it('should return all jobs', async () => {
      const jobs = [{ id: 'uuid-1', title: 'Job 1' }];
      (service.findAll as jest.Mock).mockResolvedValue(jobs);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(jobs);
    });
  });
});
