import { Module } from '@nestjs/common';
import { FreelancerService } from './freelancer.service';
import { FreelancerController } from './freelancer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';

@Module({
  imports:[TypeOrmModule.forFeature([User])],
  controllers: [FreelancerController],
  providers: [FreelancerService],
  exports:[FreelancerService]
})
export class FreelancerModule {}
