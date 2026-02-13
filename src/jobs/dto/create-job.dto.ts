import { IsInt, IsNotEmpty, IsOptional, IsPositive, IsString } from 'class-validator';

export class CreateJobDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  region: string;

  @IsInt()
  @IsPositive()
  price: number;
}
