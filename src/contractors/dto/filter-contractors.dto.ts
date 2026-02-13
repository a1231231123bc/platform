import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ContractorType } from '@prisma/client';

export class FilterContractorsDto {
  @IsString()
  @IsOptional()
  region?: string;

  @IsEnum(ContractorType)
  @IsOptional()
  type?: ContractorType;
}
