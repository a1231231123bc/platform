import { Body, Controller, Get, Post } from '@nestjs/common';
import { ContractorsService } from './contractors.service';

@Controller('contractors')
export class ContractorsController {
  constructor(private readonly contractorsService: ContractorsService) {}

  @Post()
  create(@Body() body: {
    name: string;
    phone: string;
    type: 'INDIVIDUAL' | 'IP' | 'COMPANY';
    region: string;
  }) {
    return this.contractorsService.create(body);
  }

  @Get()
  findAll() {
    return this.contractorsService.findAll();
  }
}
