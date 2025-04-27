import { Module } from '@nestjs/common';
import { MilestonesController } from './milestones.controller';
import { MilestonesService } from './milestones.service';
import { InvoicesModule } from './invoices/invoices.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Milestone } from 'src/entities/milestone.entity';

@Module({
  imports: [InvoicesModule,TypeOrmModule.forFeature([Milestone])],
  controllers: [MilestonesController],
  providers: [MilestonesService],
  exports: [MilestonesService],
})
export class MilestonesModule {} 