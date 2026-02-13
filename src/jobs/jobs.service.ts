import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateJobDto } from './dto/create-job.dto';

@Injectable()
export class JobsService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateJobDto) {
    return this.prisma.job.create({
      data: {
        ...dto,
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
