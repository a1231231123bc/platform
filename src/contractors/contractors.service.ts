import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContractorDto } from './dto/create-contractor.dto';
import { FilterContractorsDto } from './dto/filter-contractors.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ContractorsService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateContractorDto) {
    return this.prisma.contractor.create({ data: dto });
  }

  findAll(filter: FilterContractorsDto) {
    const where: Prisma.ContractorWhereInput = { active: true };

    if (filter.region) {
      where.region = filter.region;
    }
    if (filter.type) {
      where.type = filter.type;
    }

    return this.prisma.contractor.findMany({ where });
  }
}
