import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { InvitesService } from './invites.service';
import { CreateInviteDto } from './dto/create-invite.dto';
import { UpdateInviteStatusDto } from './dto/update-invite-status.dto';

@Controller()
export class InvitesController {
  constructor(private readonly invitesService: InvitesService) {}

  @Post('jobs/:jobId/invites')
  create(@Param('jobId') jobId: string, @Body() dto: CreateInviteDto) {
    return this.invitesService.create(jobId, dto);
  }

  @Get('jobs/:jobId/invites')
  findByJob(@Param('jobId') jobId: string) {
    return this.invitesService.findByJob(jobId);
  }

  @Patch('invites/:id/status')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateInviteStatusDto) {
    return this.invitesService.updateStatus(id, dto.status);
  }
}
