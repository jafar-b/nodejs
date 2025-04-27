import { Injectable, NotFoundException, ForbiddenException, forwardRef, Inject, Logger } from '@nestjs/common';

import { ProjectsService } from '../projects.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from 'src/entities/project.entity';
import { Repository } from 'typeorm';
import { Bid } from 'src/entities/bid.entity';
import { CreateBidDto,UpdateBidDto } from 'src/dtos/bid.dto';
import { Not } from 'typeorm';
import { BidStatus } from 'src/entities/bid.entity';
import { log } from 'console';
@Injectable()
export class BidsService {
  constructor(
    @Inject(forwardRef(() => ProjectsService))
    private readonly projectsService: ProjectsService,@InjectRepository(Bid) private readonly projectsRepo:Repository<Bid>  // Inject ProjectsService
  ) {}

  create(createBidDto: CreateBidDto, freelancerId: number, projectId: number) {
    const { estimated_days, ...rest } = createBidDto;
    const newBid = this.projectsRepo.create({
      ...rest,
      freelancerId,
      projectId,
      estimatedDays: estimated_days,
      status: BidStatus.PENDING,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return this.projectsRepo.save(newBid);
  }

  async findAllByProject(projectId: number) {
    log(projectId)
    return this.projectsRepo.find({ where: { projectId } });
  }

  async findAllByFreelancer(freelancerId: number) {
    return this.projectsRepo.find({ where: { freelancerId } });
  }

  async findOne(id: number) {
    const bid = await this.projectsRepo.findOne({ where: { id } });
    if (!bid) {
      throw new NotFoundException(`Bid with ID ${id} not found`);
    }
    return bid;
  }

  async update(id: number, updateBidDto: UpdateBidDto, freelancerId: number) {
    const bid = await this.findOne(id);

    if (bid.freelancerId !== freelancerId) {
      throw new ForbiddenException('You do not have permission to update this bid');
    }

    if (bid.status !== 'PENDING') {
      throw new ForbiddenException('Can only update pending bids');
    }

    Object.assign(bid, updateBidDto, { updatedAt: new Date() });
    return this.projectsRepo.save(bid);
  }

  async remove(id: number, freelancerId: number) {
    const bid = await this.findOne(id);

    if (bid.freelancerId !== freelancerId) {
      throw new ForbiddenException('You do not have permission to delete this bid');
    }

    if (bid.status !== 'PENDING') {
      throw new ForbiddenException('Can only delete pending bids');
    }

    await this.projectsRepo.remove(bid);
    return { success: true };
  }

  async acceptBid(id: number, clientId: number, projectId: number) {
    const bid = await this.findOne(id);

    if (bid.projectId !== projectId) {
      throw new ForbiddenException('Bid does not belong to this project');
    }

    const project = await this.projectsService.findOne(projectId.toString());

    if (project.clientId !== clientId) {
      throw new ForbiddenException('You do not have permission to accept this bid');
    }

    bid.status = BidStatus.ACCEPTED;
    bid.updatedAt = new Date();

    await this.projectsRepo.save(bid);

    const otherBids = await this.projectsRepo.find({ where: { projectId, id: Not(id) } });
    for (const otherBid of otherBids) {
      otherBid.status = BidStatus.REJECTED;
      otherBid.updatedAt = new Date();
      await this.projectsRepo.save(otherBid);
    }

    await this.projectsService.assignProject(projectId, bid.freelancerId);

    return bid;
  }
}