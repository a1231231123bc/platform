import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InviteStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInviteDto } from './dto/create-invite.dto';

@Injectable()
export class InvitesService {
  constructor(private prisma: PrismaService) {}

  async create(jobId: string, dto: CreateInviteDto) {
    const job = await this.prisma.job.findUnique({ where: { id: jobId } });
    if (!job) {
      throw new NotFoundException(`Job with id ${jobId} not found`);
    }

    const contractor = await this.prisma.contractor.findUnique({
      where: { id: dto.contractorId },
    });
    if (!contractor) {
      throw new NotFoundException(
        `Contractor with id ${dto.contractorId} not found`,
      );
    }

    return this.prisma.invite.create({
      data: {
        jobId,
        contractorId: dto.contractorId,
      },
    });
  }

  async findByJob(jobId: string) {
    return this.prisma.invite.findMany({
      where: { jobId },
      include: { contractor: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(id: string, newStatus: InviteStatus) {
    const invite = await this.prisma.invite.findUnique({ where: { id } });
    if (!invite) {
      throw new NotFoundException(`Invite with id ${id} not found`);
    }

    if (invite.status !== InviteStatus.PENDING) {
      throw new BadRequestException(
        `Invite already ${invite.status.toLowerCase()}`,
      );
    }

    return this.prisma.invite.update({
      where: { id },
      data: { status: newStatus },
    });
  }
}
