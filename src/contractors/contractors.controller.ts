import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ContractorsService } from './contractors.service';
import { CreateContractorDto } from './dto/create-contractor.dto';
import { FilterContractorsDto } from './dto/filter-contractors.dto';

@Controller('contractors')
export class ContractorsController {
  constructor(private readonly contractorsService: ContractorsService) {}

  @Post()
  create(@Body() dto: CreateContractorDto) {
    return this.contractorsService.create(dto);
  }

  @Get()
  findAll(@Query() filter: FilterContractorsDto) {
    return this.contractorsService.findAll(filter);
  }
}
