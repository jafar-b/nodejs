import { Module, forwardRef } from '@nestjs/common';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { BidsModule } from './bids/bids.module';
import { UploadsModule } from '../uploads/uploads.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from 'src/entities/project.entity';
import { Bid } from 'src/entities/bid.entity';

@Module({
  imports: [
    forwardRef(() => BidsModule),
    UploadsModule, // Ensure UploadsModule is imported here
    TypeOrmModule.forFeature([Project,Bid])
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService],
  exports: [ProjectsService, ProjectsModule],
})
export class ProjectsModule {}