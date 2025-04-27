import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  Request,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';

import { FilesInterceptor } from '@nestjs/platform-express';
import { UploadsService } from '../uploads/uploads.service';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateProjectDto, UpdateProjectDto } from 'src/dtos/project.dto';

@Controller('projects')
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly uploadsService: UploadsService,
  ) {}

  @Post()
  @Roles('client')
  @UseInterceptors(FilesInterceptor('attachments'))
  create(
    @Body() createProjectDto: CreateProjectDto, 
    @Request() req,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    return this.projectsService.create(createProjectDto, req.user.userId, files);
  }

  @Get()
  @Public()
  findAll() {
    return this.projectsService.findAll();
  }

  @Get('my-projects')
  @Roles('client')
  findMyProjects(@Request() req) {
    return this.projectsService.findByClient(req.user.userId);
  }
 
  @Get('freelancer-projects')
  @Roles('freelancer')
  findFreelancerProjects(@Request() req) {
    return this.projectsService.findByFreelancer(req.user.userId);
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(id);
  }

  @Patch(':id') 
  @Roles('client', 'freelancer')
  update(
    @Param('id') id: string, 
    @Body() updateProjectDto: UpdateProjectDto,
    @Request() req,
  ) {
    return this.projectsService.update(
      id, 
      updateProjectDto, 
      req.user.userId,
      req.user.role,
    );
  }

  @Delete(':id')
  @Roles('client')
  remove(@Param('id') id: string, @Request() req) {
    return this.projectsService.remove(
      id, 
      req.user.userId,
      req.user.role,
    );
  }
}