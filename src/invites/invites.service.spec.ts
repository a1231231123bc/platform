import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { InvitesService } from './invites.service';
import { PrismaService } from '../prisma/prisma.service';
import { InviteStatus } from '@prisma/client';

describe('InvitesService', () => {
  let service: InvitesService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvitesService,
        {
          provide: PrismaService,
          useValue: {
            invite: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
            },
            job: {
              findUnique: jest.fn(),
            },
            contractor: {
              findUnique: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<InvitesService>(InvitesService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('create', () => {
    it('should create an invite', async () => {
      const job = { id: 'job-1' };
      const contractor = { id: 'contractor-1' };
      const invite = {
        id: 'invite-1',
        jobId: 'job-1',
        contractorId: 'contractor-1',
        status: 'PENDING',
      };

      (prisma.job.findUnique as jest.Mock).mockResolvedValue(job);
      (prisma.contractor.findUnique as jest.Mock).mockResolvedValue(contractor);
      (prisma.invite.create as jest.Mock).mockResolvedValue(invite);

      const result = await service.create('job-1', {
        contractorId: 'contractor-1',
      });

      expect(prisma.invite.create).toHaveBeenCalledWith({
        data: { jobId: 'job-1', contractorId: 'contractor-1' },
      });
      expect(result).toEqual(invite);
    });

    it('should throw NotFoundException when job not found', async () => {
      (prisma.job.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(
        service.create('nonexistent', { contractorId: 'contractor-1' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when contractor not found', async () => {
      (prisma.job.findUnique as jest.Mock).mockResolvedValue({ id: 'job-1' });
      (prisma.contractor.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(
        service.create('job-1', { contractorId: 'nonexistent' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByJob', () => {
    it('should return invites for a job with contractor info', async () => {
      const invites = [
        { id: 'invite-1', jobId: 'job-1', contractor: { name: 'Иванов' } },
      ];
      (prisma.invite.findMany as jest.Mock).mockResolvedValue(invites);

      const result = await service.findByJob('job-1');

      expect(prisma.invite.findMany).toHaveBeenCalledWith({
        where: { jobId: 'job-1' },
        include: { contractor: true },
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual(invites);
    });
  });

  describe('updateStatus', () => {
    it('should accept a pending invite', async () => {
      const invite = { id: 'invite-1', status: InviteStatus.PENDING };
      const updated = { ...invite, status: InviteStatus.ACCEPTED };

      (prisma.invite.findUnique as jest.Mock).mockResolvedValue(invite);
      (prisma.invite.update as jest.Mock).mockResolvedValue(updated);

      const result = await service.updateStatus(
        'invite-1',
        InviteStatus.ACCEPTED,
      );

      expect(prisma.invite.update).toHaveBeenCalledWith({
        where: { id: 'invite-1' },
        data: { status: InviteStatus.ACCEPTED },
      });
      expect(result).toEqual(updated);
    });

    it('should decline a pending invite', async () => {
      const invite = { id: 'invite-1', status: InviteStatus.PENDING };
      const updated = { ...invite, status: InviteStatus.DECLINED };

      (prisma.invite.findUnique as jest.Mock).mockResolvedValue(invite);
      (prisma.invite.update as jest.Mock).mockResolvedValue(updated);

      const result = await service.updateStatus(
        'invite-1',
        InviteStatus.DECLINED,
      );

      expect(result).toEqual(updated);
    });

    it('should throw NotFoundException when invite not found', async () => {
      (prisma.invite.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(
        service.updateStatus('nonexistent', InviteStatus.ACCEPTED),
      ).rejects.toThrow(NotFoundException);
    });

    it('should reject status change on already accepted invite', async () => {
      const invite = { id: 'invite-1', status: InviteStatus.ACCEPTED };
      (prisma.invite.findUnique as jest.Mock).mockResolvedValue(invite);

      await expect(
        service.updateStatus('invite-1', InviteStatus.DECLINED),
      ).rejects.toThrow(BadRequestException);
    });

    it('should reject status change on already declined invite', async () => {
      const invite = { id: 'invite-1', status: InviteStatus.DECLINED };
      (prisma.invite.findUnique as jest.Mock).mockResolvedValue(invite);

      await expect(
        service.updateStatus('invite-1', InviteStatus.ACCEPTED),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
