import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Milestone } from 'src/entities/milestone.entity';
import { CreateMilestoneDto, UpdateMilestoneDto } from 'src/dtos/milestone.dto';
import { MilestoneStatus } from 'src/entities/milestone.entity';
import { Repository } from 'typeorm';
import { UserRole } from 'src/enums/allEnums';

@Injectable()
export class MilestonesService {

constructor(@InjectRepository(Milestone) private readonly milestoneRepo:Repository<Milestone>){}

async create(createMilestoneDto: CreateMilestoneDto, clientId: string) {
    const newMilestone = this.milestoneRepo.create({
      ...createMilestoneDto,
      projectId: createMilestoneDto.projectId,
      dueDate: createMilestoneDto.dueDate,
      clientId: +clientId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return await this.milestoneRepo.save(newMilestone);
  }

  async findAll() {
    return await this.milestoneRepo.find({
      relations: ['project'],
      select: {
        id: true,
        title: true,
        description: true,
        amount: true,
        dueDate: true,
        status: true,
        projectId: true,
        clientId: true,
        createdAt: true,
        updatedAt: true,
        project: {
          id: true,
          title: true
        }
      }
    });
  }

  async findAllByProject(projectId: string) {
    return await this.milestoneRepo.find({
      where: { projectId: +projectId },
      relations: ['project'],
      select: {
        id: true,
        title: true,
        description: true,
        amount: true,
        dueDate: true,
        status: true,
        projectId: true,
        clientId: true,
        createdAt: true,
        updatedAt: true,
        project: {
          id: true,
          title: true
        }
      }
    });
  }

  async findAllByClient(clientId: string) {
    return await this.milestoneRepo.find({
      where: { clientId: +clientId },
      relations: ['project'],
      select: {
        id: true,
        title: true,
        description: true,
        amount: true,
        dueDate: true,
        status: true,
        projectId: true,
        clientId: true,
        createdAt: true,
        updatedAt: true,
        project: {
          id: true,
          title: true
        }
      }
    });
  }

  async findOne(id: string) {
    const milestone = await this.milestoneRepo.findOne({
      where: { id: +id },
      relations: ['project'],
      select: {
        id: true,
        title: true,
        description: true,
        amount: true,
        dueDate: true,
        status: true,
        projectId: true,
        clientId: true,
        createdAt: true,
        updatedAt: true,
        project: {
          id: true,
          title: true
        }
      }
    });
    if (!milestone) {
      throw new NotFoundException(`Milestone with ID ${id} not found`);
    }
    return milestone;
  }

  async update(id: string, updateMilestoneDto: UpdateMilestoneDto, userId: string, role: string) {
    const milestone = await this.findOne(id);

    if (role === UserRole.CLIENT && milestone.clientId !== +userId) {
      throw new ForbiddenException('You do not have permission to update this milestone');
    }

    if (role === UserRole.FREELANCER) {
      if (
        Object.keys(updateMilestoneDto).length > 1 ||
        (updateMilestoneDto.status && updateMilestoneDto.status !== MilestoneStatus.COMPLETED)
      ) {
        throw new ForbiddenException('Freelancers can only mark milestones as completed');
      }
    }

    Object.assign(milestone, updateMilestoneDto, { updatedAt: new Date() });
    return await this.milestoneRepo.save(milestone);
  }

  async remove(id: string, userId: string, role: string) {
    const milestone = await this.findOne(id);

    if (role === UserRole.CLIENT && milestone.clientId !== +userId) {
      throw new ForbiddenException('You do not have permission to delete this milestone');
    }

    if (role === UserRole.FREELANCER) {
      throw new ForbiddenException('Freelancers cannot delete milestones');
    }

    if (milestone.status === MilestoneStatus.PENDING) {
      throw new ForbiddenException('Cannot delete a paid milestone');
    }

    await this.milestoneRepo.remove(milestone);
    return { success: true };
  }

  async releaseMilestonePayment(id: string, clientId: string) {
    const milestone = await this.findOne(id);

    if (milestone.clientId !== +clientId) {
      throw new ForbiddenException('You do not have permission to release payment for this milestone');
    }

    if (milestone.status !== MilestoneStatus.COMPLETED) {
      throw new ForbiddenException('Can only release payment for completed milestones');
    }

    milestone.status = MilestoneStatus.PENDING;
    milestone.updatedAt = new Date();

    return await this.milestoneRepo.save(milestone);
  }

  async completeMilestone(id: string, freelancerId: string) {
    const milestone = await this.findOne(id);
    
    // Verify the project is assigned to this freelancer
    // Note: This would ideally check if the freelancer is assigned to the project
    // You may need to adjust this logic based on your project structure
    
    if (milestone.status !== MilestoneStatus.PENDING) {
      throw new ForbiddenException('Can only mark pending milestones as complete');
    }
    
    milestone.status = MilestoneStatus.COMPLETED;
    milestone.updatedAt = new Date();
    
    return await this.milestoneRepo.save(milestone);
  }
}

