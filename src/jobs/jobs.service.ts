import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { JobStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateJobDto } from './dto/create-job.dto';
import { FilterJobsDto } from './dto/filter-jobs.dto';

const VALID_TRANSITIONS: Record<JobStatus, JobStatus[]> = {
  DRAFT: [JobStatus.ACTIVE],
  ACTIVE: [JobStatus.CLOSED],
  CLOSED: [],
};

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

  async updateStatus(id: string, newStatus: JobStatus) {
    const job = await this.findOne(id);

    const allowed = VALID_TRANSITIONS[job.status];
    if (!allowed.includes(newStatus)) {
      throw new BadRequestException(
        `Cannot transition from ${job.status} to ${newStatus}`,
      );
    }

    return this.prisma.job.update({
      where: { id },
      data: { status: newStatus },
    });
  }
}
