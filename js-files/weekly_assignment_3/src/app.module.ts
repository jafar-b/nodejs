import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LibraryMgtModule } from './library-mgt/library-mgt.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskManagerModule } from './task-manager/task-manager.module';

@Module({
  imports: [ TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'root',
    database: 'week3',
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: true, 
    logging: true,
  }),LibraryMgtModule, TaskManagerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
