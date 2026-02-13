import { Test, TestingModule } from '@nestjs/testing';
import { ContractorsService } from './contractors.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContractorDto } from './dto/create-contractor.dto';
import { ContractorType } from '@prisma/client';

describe('ContractorsService', () => {
  let service: ContractorsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContractorsService,
        {
          provide: PrismaService,
          useValue: {
            contractor: {
              create: jest.fn(),
              findMany: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<ContractorsService>(ContractorsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('create', () => {
    it('should create a contractor with valid data', async () => {
      const dto: CreateContractorDto = {
        name: 'Иван Иванов',
        phone: '+79991234567',
        type: ContractorType.INDIVIDUAL,
        region: 'Москва',
      };
      const expected = { id: 'uuid-1', ...dto, active: true, createdAt: new Date() };
      (prisma.contractor.create as jest.Mock).mockResolvedValue(expected);

      const result = await service.create(dto);

      expect(prisma.contractor.create).toHaveBeenCalledWith({ data: dto });
      expect(result).toEqual(expected);
    });
  });

  describe('findAll', () => {
    it('should return only active contractors', async () => {
      const contractors = [{ id: 'uuid-1', name: 'Иван', active: true }];
      (prisma.contractor.findMany as jest.Mock).mockResolvedValue(contractors);

      const result = await service.findAll();

      expect(prisma.contractor.findMany).toHaveBeenCalledWith({
        where: { active: true },
      });
      expect(result).toEqual(contractors);
    });
  });
});
