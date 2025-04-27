import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Milestone } from 'src/entities/milestone.entity';
import { CreateMilestoneDto, UpdateMilestoneDto } from 'src/dtos/milestone.dto';
import { MilestoneStatus } from 'src/entities/milestone.entity';
import { Repository } from 'typeorm';

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
    return await this.milestoneRepo.find();
  }

  async findAllByProject(projectId: string) {
    return await this.milestoneRepo.find({ where: { projectId: +projectId } });
  }

  async findAllByClient(clientId: string) {
    return await this.milestoneRepo.find({ where: { clientId: +clientId } });
  }

  async findOne(id: string) {
    const milestone = await this.milestoneRepo.findOne({ where: { id: +id } });
    if (!milestone) {
      throw new NotFoundException(`Milestone with ID ${id} not found`);
    }
    return milestone;
  }

  async update(id: string, updateMilestoneDto: UpdateMilestoneDto, userId: string, role: string) {
    const milestone = await this.findOne(id);

    if (role === 'client' && milestone.clientId !== +userId) {
      throw new ForbiddenException('You do not have permission to update this milestone');
    }

    if (role === 'freelancer') {
      if (
        Object.keys(updateMilestoneDto).length > 1 ||
        (updateMilestoneDto.status && updateMilestoneDto.status !== 'COMPLETED')
      ) {
        throw new ForbiddenException('Freelancers can only mark milestones as completed');
      }
    }

    Object.assign(milestone, updateMilestoneDto, { updatedAt: new Date() });
    return await this.milestoneRepo.save(milestone);
  }

  async remove(id: string, userId: string, role: string) {
    const milestone = await this.findOne(id);

    if (role === 'client' && milestone.clientId !== +userId) {
      throw new ForbiddenException('You do not have permission to delete this milestone');
    }

    if (role === 'freelancer') {
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

    if (milestone.status !== 'COMPLETED') {
      throw new ForbiddenException('Can only release payment for completed milestones');
    }

    milestone.status = MilestoneStatus.PENDING;
    milestone.updatedAt = new Date();

    return await this.milestoneRepo.save(milestone);
  }
}

