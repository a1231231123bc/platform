import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { JobsModule } from './jobs/jobs.module';
import { ContractorsModule } from './contractors/contractors.module';
import { InvitesModule } from './invites/invites.module';
import { AuthModule } from './auth/auth.module';
import { LoggingMiddleware } from './logging.middleware';

@Module({
  imports: [PrismaModule, AuthModule, JobsModule, ContractorsModule, InvitesModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
