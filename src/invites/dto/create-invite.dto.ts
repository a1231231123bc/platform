import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateInviteDto {
  @IsUUID()
  @IsNotEmpty()
  contractorId: string;
}
