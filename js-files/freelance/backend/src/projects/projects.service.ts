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
    
    // Ensure status is set to OPEN by default
    if (!createProjectDto.status) {
      createProjectDto.status = ProjectStatus.OPEN;
    }
    
    console.log('Creating project with status:', createProjectDto.status);
    
    const newProject = this.projectRepo.create({
      ...createProjectDto,
      clientId: +clientId,
      attachments,
    });
    
    const savedProject = await this.projectRepo.save(newProject);
    console.log('Saved project with status:', savedProject.status);
    
    return savedProject;
  }

  async findAll(query?: { status?: string }) {
    // Build query object
    const whereCondition: any = {};
    
    // Add status filter if provided
    if (query?.status) {
      whereCondition.status = query.status;
    }
    
    const projects = await this.projectRepo.find({
      where: Object.keys(whereCondition).length > 0 ? whereCondition : undefined,
      relations: ['client', 'assignedFreelancer', 'category', 'bids'],
      select: {
        id: true,
        title: true,
        description: true,
        budget: true,
        deadline: true,
        status: true,
        categoryId: true,
        clientId: true,
        assignedFreelancerId: true,
        createdAt: true,
        updatedAt: true,
        attachments: true,
        bidsCount: true,
        client: {
          id: true,
          firstName: true,
          lastName: true,
          profile: {
            profileImage: true
          }
        },
        assignedFreelancer: {
          id: true,
          firstName: true,
          lastName: true,
          profile: {
            profileImage: true
          }
        },
        category: {
          id: true,
          name: true
        },
        bids: {
          id: true
        }
      }
    });

    return projects;
  }

  async findByClient(clientId: string) {
    const projects = await this.projectRepo.find({
      where: { clientId: +clientId },
      relations: ['client', 'assignedFreelancer', 'category', 'bids'],
      select: {
        id: true,
        title: true,
        description: true,
        budget: true,
        deadline: true,
        status: true,
        categoryId: true,
        clientId: true,
        assignedFreelancerId: true,
        createdAt: true,
        updatedAt: true,
        attachments: true,
        bidsCount: true,
        client: {
          id: true,
          firstName: true,
          lastName: true,
          profile: {
            profileImage: true
          }
        },
        assignedFreelancer: {
          id: true,
          firstName: true,
          lastName: true,
          profile: {
            profileImage: true
          }
        },
        category: {
          id: true,
          name: true
        },
        bids: {
          id: true
        }
      }
    });

    return projects;
  }

  async findByFreelancer(freelancerId: string) {
    try {
      const [assignedProjects, bidProjects] = await Promise.all([
        // Get projects where freelancer is assigned
        this.projectRepo.find({
          where: { assignedFreelancerId: +freelancerId },
          relations: ['client', 'assignedFreelancer', 'category', 'bids'],
          select: {
            id: true,
            title: true,
            description: true,
            budget: true,
            deadline: true,
            status: true,
            categoryId: true,
            clientId: true,
            assignedFreelancerId: true,
            createdAt: true,
            updatedAt: true,
            attachments: true,
            bidsCount: true,
            client: {
              id: true,
              firstName: true,
              lastName: true,
              profile: {
                profileImage: true
              }
            },
            assignedFreelancer: {
              id: true,
              firstName: true,
              lastName: true,
              profile: {
                profileImage: true
              }
            },
            category: {
              id: true,
              name: true
            },
            bids: {
              id: true
            }
          }
        }),
        // Get projects where freelancer has placed bids
        this.projectRepo
          .createQueryBuilder('project')
          .innerJoin('project.bids', 'bid')
          .where('bid.freelancerId = :freelancerId', { freelancerId: +freelancerId })
          .andWhere('project.assignedFreelancerId IS NULL')
          .andWhere('project.status = :status', { status: 'OPEN' })
          .leftJoinAndSelect('project.client', 'client')
          .leftJoinAndSelect('client.profile', 'clientProfile')
          .leftJoinAndSelect('project.category', 'category')
          .leftJoinAndSelect('project.bids', 'bids')
          .select([
            'project.id',
            'project.title',
            'project.description',
            'project.budget',
            'project.deadline',
            'project.status',
            'project.categoryId',
            'project.clientId',
            'project.assignedFreelancerId',
            'project.createdAt',
            'project.updatedAt',
            'project.attachments',
            'project.bidsCount',
            'client.id',
            'client.firstName',
            'client.lastName',
            'clientProfile.profileImage',
            'category.id',
            'category.name',
            'bids.id'
          ])
          .getMany()
      ]);

      // Combine and deduplicate projects
      const allProjects = [...assignedProjects];
      const projectIds = new Set(assignedProjects.map(p => p.id));
      
      bidProjects.forEach(project => {
        if (!projectIds.has(project.id)) {
          allProjects.push(project);
          projectIds.add(project.id);
        }
      });

      // Transform the data to match frontend expectations
      const transformedProjects = allProjects.map(project => {
        try {
          return {
            id: project.id.toString(),
            title: project.title || '',
            description: project.description || '',
            budget: Number(project.budget) || 0,
            deadline: project.deadline ? new Date(project.deadline).toISOString() : new Date().toISOString(),
            status: project.status || 'OPEN',
            category: project.category?.name || 'Uncategorized',
            bidsCount: project.bidsCount || 0,
            clientName: project.client ? `${project.client.firstName || ''} ${project.client.lastName || ''}`.trim() : 'Unknown Client',
            freelancerName: project.assignedFreelancer 
              ? `${project.assignedFreelancer.firstName || ''} ${project.assignedFreelancer.lastName || ''}`.trim()
              : null
          };
        } catch (error) {
          console.error('Error transforming project:', error);
          return null;
        }
      }).filter(Boolean); // Remove any null entries from failed transformations

      return { data: transformedProjects };
    } catch (error) {
      console.error('Error in findByFreelancer:', error);
      return { data: [] }; // Return empty array instead of throwing error
    }
  }

  async findOne(id: string) {
    const project = await this.projectRepo.findOne({ 
      where: { id: +id },
      relations: ['client', 'assignedFreelancer', 'category', 'bids'],
      select: {
        id: true,
        title: true,
        description: true,
        budget: true,
        deadline: true,
        status: true,
        categoryId: true,
        clientId: true,
        assignedFreelancerId: true,
        createdAt: true,
        updatedAt: true,
        attachments: true,
        bidsCount: true,
        client: {
          id: true,
          firstName: true,
          lastName: true,
          profile: {
            profileImage: true
          }
        },
        assignedFreelancer: {
          id: true,
          firstName: true,
          lastName: true,
          profile: {
            profileImage: true
          }
        },
        category: {
          id: true,
          name: true
        },
        bids: {
          id: true
        }
      }
    });

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

  async getById(projectId: number): Promise<Project> {
    const project = await this.projectRepo.findOne({
      where: { id: projectId },
      relations: ['client', 'assignedFreelancer', 'category', 'bids'],
      select: {
        id: true,
        title: true,
        description: true,
        budget: true,
        deadline: true,
        status: true,
        categoryId: true,
        clientId: true,
        assignedFreelancerId: true,
        createdAt: true,
        updatedAt: true,
        attachments: true,
        bidsCount: true,
        client: {
          id: true,
          firstName: true,
          lastName: true,
          profile: {
            profileImage: true
          }
        },
        assignedFreelancer: {
          id: true,
          firstName: true,
          lastName: true,
          profile: {
            profileImage: true
          }
        },
        category: {
          id: true,
          name: true
        },
        bids: {
          id: true
        }
      }
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }

    return project;
  }

  async assignProject(projectId: number, freelancerId: number): Promise<Project> {
    const project = await this.getById(projectId);
    project.assignedFreelancerId = freelancerId;
    project.status = ProjectStatus.ASSIGNED;
    project.updatedAt = new Date();
    return this.projectRepo.save(project);
  }
} 