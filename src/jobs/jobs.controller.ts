import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { FilterJobsDto } from './dto/filter-jobs.dto';
import { UpdateJobStatusDto } from './dto/update-job-status.dto';

@ApiTags('Jobs')
@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  create(@Body() dto: CreateJobDto) {
    return this.jobsService.create(dto);
  }

  @Get()
  findAll(@Query() filter: FilterJobsDto) {
    return this.jobsService.findAll(filter);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobsService.findOne(id);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateJobStatusDto) {
    return this.jobsService.updateStatus(id, dto.status);
  }
}
