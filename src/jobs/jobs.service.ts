import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateJobDto } from './dto/create-job.dto';
import { FilterJobsDto } from './dto/filter-jobs.dto';
import { Prisma } from '@prisma/client';

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

  findAll(filter: FilterJobsDto) {
    const where: Prisma.JobWhereInput = {};

    if (filter.status) {
      where.status = filter.status;
    }
    if (filter.region) {
      where.region = filter.region;
    }

    return this.prisma.job.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const job = await this.prisma.job.findUnique({ where: { id } });
    if (!job) {
      throw new NotFoundException(`Job with id ${id} not found`);
    }
    return job;
  }
}
