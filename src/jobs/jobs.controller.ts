import { Body, Controller, Get, Post } from '@nestjs/common';
import { JobsService } from './jobs.service';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  create(@Body() body: {
    title: string;
    description?: string;
    region: string;
    price: number;
  }) {
    return this.jobsService.create(body);
  }

  @Get()
  findAll() {
    return this.jobsService.findAll();
  }
}
