import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JobsService {
  constructor(private prisma: PrismaService) {}

  create(data: {
    title: string;
    description?: string;
    region: string;
    price: number;
  }) {
    return this.prisma.job.create({
      data: {
        ...data,
        status: 'ACTIVE',
      },
    });
  }

  findAll() {
    return this.prisma.job.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }
}
