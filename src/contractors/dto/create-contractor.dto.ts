import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ContractorType } from '@prisma/client';

export class CreateContractorDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsEnum(ContractorType)
  type: ContractorType;

  @IsString()
  @IsNotEmpty()
  region: string;
}
