import { Module } from '@nestjs/common';
import { TaskManagerService } from './task-manager.service';
import { TaskManagerController } from './task-manager.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Task } from './entities/task.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports:[
    TypeOrmModule.forFeature([User,Task]),
    JwtModule.register({
      secret: 'your_jwt_secret', 
      signOptions: { expiresIn: '1h' }, 
    }),
  ],
  controllers: [TaskManagerController],
  providers: [TaskManagerService,],
})
export class TaskManagerModule {}
