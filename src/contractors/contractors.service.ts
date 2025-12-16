import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ContractorsService {
  constructor(private prisma: PrismaService) {}

  create(data: {
    name: string;
    phone: string;
    type: 'INDIVIDUAL' | 'IP' | 'COMPANY';
    region: string;
  }) {
    return this.prisma.contractor.create({ data });
  }

  findAll() {
    return this.prisma.contractor.findMany({
      where: { active: true },
    });
  }
}
