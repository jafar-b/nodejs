import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientModule } from './client/client.module';

import { FreelancerModule } from './freelancer/freelancer.module';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { ProjectsModule } from './projects/projects.module';
import { MessagesModule } from './messages/messages.module';
import { MilestonesModule } from './milestones/milestones.module';
import { UploadsModule } from './uploads/uploads.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/database.config';
import { UserModule } from './user/user.module';
import { SkillsModule } from './skills/skills.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    ClientModule,

    FreelancerModule,
    AuthModule,
    ProjectsModule,
    MessagesModule,
    MilestonesModule,
    UploadsModule,
    UserModule,
    SkillsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
