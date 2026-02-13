import { Test, TestingModule } from '@nestjs/testing';
import { ContractorsController } from './contractors.controller';
import { ContractorsService } from './contractors.service';
import { CreateContractorDto } from './dto/create-contractor.dto';
import { ContractorType } from '@prisma/client';

describe('ContractorsController', () => {
  let controller: ContractorsController;
  let service: ContractorsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContractorsController],
      providers: [
        {
          provide: ContractorsService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ContractorsController>(ContractorsController);
    service = module.get<ContractorsService>(ContractorsService);
  });

  describe('create', () => {
    it('should call service.create with dto', async () => {
      const dto: CreateContractorDto = {
        name: 'Иван Иванов',
        phone: '+79991234567',
        type: ContractorType.INDIVIDUAL,
        region: 'Москва',
      };
      const expected = { id: 'uuid-1', ...dto };
      (service.create as jest.Mock).mockResolvedValue(expected);

      const result = await controller.create(dto);

      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expected);
    });
  });

  describe('findAll', () => {
    it('should call service.findAll with empty filter', async () => {
      const contractors = [{ id: 'uuid-1', name: 'Иван' }];
      (service.findAll as jest.Mock).mockResolvedValue(contractors);

      const result = await controller.findAll({});

      expect(service.findAll).toHaveBeenCalledWith({});
      expect(result).toEqual(contractors);
    });

    it('should pass filter params to service', async () => {
      (service.findAll as jest.Mock).mockResolvedValue([]);

      await controller.findAll({ region: 'Москва', type: ContractorType.COMPANY });

      expect(service.findAll).toHaveBeenCalledWith({
        region: 'Москва',
        type: ContractorType.COMPANY,
      });
    });
  });
});
