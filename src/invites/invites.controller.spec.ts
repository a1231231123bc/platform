import { Test, TestingModule } from '@nestjs/testing';
import { InvitesController } from './invites.controller';
import { InvitesService } from './invites.service';
import { InviteStatus } from '@prisma/client';

describe('InvitesController', () => {
  let controller: InvitesController;
  let service: InvitesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InvitesController],
      providers: [
        {
          provide: InvitesService,
          useValue: {
            create: jest.fn(),
            findByJob: jest.fn(),
            updateStatus: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<InvitesController>(InvitesController);
    service = module.get<InvitesService>(InvitesService);
  });

  describe('create', () => {
    it('should call service.create with jobId and dto', async () => {
      const invite = {
        id: 'invite-1',
        jobId: 'job-1',
        contractorId: 'contractor-1',
        status: 'PENDING',
      };
      (service.create as jest.Mock).mockResolvedValue(invite);

      const result = await controller.create('job-1', {
        contractorId: 'contractor-1',
      });

      expect(service.create).toHaveBeenCalledWith('job-1', {
        contractorId: 'contractor-1',
      });
      expect(result).toEqual(invite);
    });
  });

  describe('findByJob', () => {
    it('should call service.findByJob with jobId', async () => {
      const invites = [{ id: 'invite-1' }];
      (service.findByJob as jest.Mock).mockResolvedValue(invites);

      const result = await controller.findByJob('job-1');

      expect(service.findByJob).toHaveBeenCalledWith('job-1');
      expect(result).toEqual(invites);
    });
  });

  describe('updateStatus', () => {
    it('should call service.updateStatus with id and status', async () => {
      const updated = { id: 'invite-1', status: InviteStatus.ACCEPTED };
      (service.updateStatus as jest.Mock).mockResolvedValue(updated);

      const result = await controller.updateStatus('invite-1', {
        status: InviteStatus.ACCEPTED,
      });

      expect(service.updateStatus).toHaveBeenCalledWith(
        'invite-1',
        InviteStatus.ACCEPTED,
      );
      expect(result).toEqual(updated);
    });
  });
});
