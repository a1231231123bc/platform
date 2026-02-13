import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { JobsModule } from './jobs/jobs.module';
import { ContractorsModule } from './contractors/contractors.module';
import { InvitesModule } from './invites/invites.module';

@Module({
  imports: [PrismaModule, JobsModule, ContractorsModule, InvitesModule],
})
export class AppModule {}
