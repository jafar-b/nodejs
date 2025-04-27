import { forwardRef, Module } from '@nestjs/common';
import { BidsController } from './bids.controller';
import { BidsService } from './bids.service';
import { ProjectsModule } from '../projects.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from 'src/entities/project.entity';
import { Bid } from 'src/entities/bid.entity';

@Module({
  imports:  [forwardRef(() => ProjectsModule),TypeOrmModule.forFeature([Project,Bid])],
  controllers: [BidsController],
  providers: [BidsService],
  exports: [BidsService,BidsModule],
})
export class BidsModule {} 