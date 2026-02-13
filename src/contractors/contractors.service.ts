import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContractorDto } from './dto/create-contractor.dto';

@Injectable()
export class ContractorsService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateContractorDto) {
    return this.prisma.contractor.create({ data: dto });
  }

  findAll() {
    return this.prisma.contractor.findMany({
      where: { active: true },
    });
  }
}
