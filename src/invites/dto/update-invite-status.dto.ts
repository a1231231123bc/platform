import { IsEnum, IsNotEmpty } from 'class-validator';
import { InviteStatus } from '@prisma/client';

export class UpdateInviteStatusDto {
  @IsEnum(InviteStatus)
  @IsNotEmpty()
  status: InviteStatus;
}
