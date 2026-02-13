import { IsEnum, IsOptional, IsString } from 'class-validator';
import { JobStatus } from '@prisma/client';

export class FilterJobsDto {
  @IsString()
  @IsOptional()
  region?: string;

  @IsEnum(JobStatus)
  @IsOptional()
  status?: JobStatus;
}
