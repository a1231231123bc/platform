import { Body, Controller, Get, Post } from '@nestjs/common';
import { ContractorsService } from './contractors.service';
import { CreateContractorDto } from './dto/create-contractor.dto';

@Controller('contractors')
export class ContractorsController {
  constructor(private readonly contractorsService: ContractorsService) {}

  @Post()
  create(@Body() dto: CreateContractorDto) {
    return this.contractorsService.create(dto);
  }

  @Get()
  findAll() {
    return this.contractorsService.findAll();
  }
}
