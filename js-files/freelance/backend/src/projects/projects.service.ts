import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from 'src/entities/project.entity';
import { UploadsService } from '../uploads/uploads.service';
import { CreateProjectDto, UpdateProjectDto } from 'src/dtos/project.dto';
import { ProjectStatus } from 'src/enums/allEnums';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project) private readonly projectRepo: Repository<Project>,
    private readonly uploadsService: UploadsService,
  ) {}

  async create(createProjectDto: CreateProjectDto, clientId: string, files: Array<Express.Multer.File> = []) {
    const attachments = files.length > 0 ? files.map(file => this.uploadsService.getFileUrl(file.filename)) : [];
    const newProject = this.projectRepo.create({
      ...createProjectDto,
      clientId: +clientId,
      attachments,
    });
    return await this.projectRepo.save(newProject);
  }

  async findAll() {
    return await this.projectRepo.find();
  }

  async findByClient(clientId: string) {
    return await this.projectRepo.find({ where: { clientId: +clientId } });
  }

  async findByFreelancer(freelancerId: string) {
    return await this.projectRepo.find({ where: { assignedFreelancerId: +freelancerId } });
  }

  async findOne(id: string) {
    const project = await this.projectRepo.findOne({ where: { id: +id } });
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
    return project;
  }

  async update(id: string, updateProjectDto: UpdateProjectDto, userId: string, role: string) {
    const project = await this.projectRepo.findOne({ where: { id: +id } });
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    if (role === 'client' && project.clientId !== +userId) {
      throw new ForbiddenException('You do not have permission to update this project');
    }

    if (role === 'freelancer' && project.assignedFreelancerId !== +userId) {
      throw new ForbiddenException('You do not have permission to update this project');
    }

    Object.assign(project, updateProjectDto);
    return await this.projectRepo.save(project);
  }

  async remove(id: string, userId: string, role: string) {
    const project = await this.projectRepo.findOne({ where: { id: +id } });
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    if (role === 'client' && project.clientId !== +userId) {
      throw new ForbiddenException('You do not have permission to delete this project');
    }

    await this.projectRepo.remove(project);
    return { success: true };
  }



  async findOnee(projectId: number): Promise<Project> {
    const project = await this.projectRepo.findOne({ where: { id: projectId } });
    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }
    return project;
  }

  async assignProject(projectId: number, freelancerId: number): Promise<Project> {
    const project = await this.findOnee(projectId);
    project.assignedFreelancerId = freelancerId;
    project.status = ProjectStatus.ASSIGNED;
    project.updatedAt = new Date();
    return this.projectRepo.save(project);
  }


} 