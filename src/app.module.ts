import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { JobsModule } from './jobs/jobs.module';
import { ContractorsModule } from './contractors/contractors.module';

@Module({
  imports: [PrismaModule, JobsModule, ContractorsModule],
})
export class AppModule {}
