import { Controller, Get, Post, Body, Patch, Param, Delete, Request, ForbiddenException, BadRequestException } from '@nestjs/common';
import { BidsService } from './bids.service';
import { CreateBidDto, UpdateBidDto } from '../../dtos/bid.dto';

import { Roles } from '../../auth/decorators/roles.decorator';
import { ProjectsService } from '../projects.service';

@Controller('projects/:projectId/bids')
export class BidsController {
  constructor(
    private readonly bidsService: BidsService,
    private readonly projectsService: ProjectsService,
  ) {}

  private parseProjectId(projectId: string): number {
    const parsedId = parseInt(projectId, 10);
    if (isNaN(parsedId)) {
      throw new BadRequestException('Invalid project ID');
    }
    return parsedId;
  }

  @Post()
  @Roles('freelancer')
  async create(
    @Param('projectId') projectId: string,
    @Body() createBidDto: CreateBidDto,
    @Request() req,
  ) {
    const parsedProjectId = this.parseProjectId(projectId);
    const project = await this.projectsService.findOne(parsedProjectId.toString());

    if (project.status !== 'OPEN') {
      throw new ForbiddenException('Project is not open for bids');
    }

    if (project.clientId === req.user.userId) {
      throw new ForbiddenException('You cannot bid on your own project');
    }

    const existingBids = await this.bidsService.findAllByFreelancer(req.user.userId);
    const alreadyBid = existingBids.some(bid => bid.projectId === parsedProjectId);
    if (alreadyBid) {
      throw new ForbiddenException('You have already placed a bid on this project');
    }

    return this.bidsService.create(createBidDto, req.user.userId, parsedProjectId);
  }

  @Get()
  async findAll(@Param('projectId') projectId: string, @Request() req) {
    const parsedProjectId = this.parseProjectId(projectId);
    const project = await this.projectsService.findOne(parsedProjectId.toString());

    if (req.user.role === 'client' && project.clientId !== req.user.userId) {
      throw new ForbiddenException('You do not have permission to view these bids');
    }

    return this.bidsService.findAllByProject(parsedProjectId);
  }

  @Get(':id')
  async findOne(
    @Param('projectId') projectId: string,
    @Param('id') id: string,
    @Request() req,
  ) {
    const parsedProjectId = this.parseProjectId(projectId);
    const parsedId = this.parseProjectId(id);
    const bid = await this.bidsService.findOne(parsedId);

    if (bid.projectId !== parsedProjectId) {
      throw new ForbiddenException('Bid does not belong to this project');
    }

    const project = await this.projectsService.findOne(parsedProjectId.toString());

    if (req.user.role === 'client' && project.clientId !== req.user.userId) {
      throw new ForbiddenException('You do not have permission to view this bid');
    }

    if (req.user.role === 'freelancer' && bid.freelancerId !== req.user.userId) {
      throw new ForbiddenException('You do not have permission to view this bid');
    }

    return bid;
  }

  @Patch(':id')
  async update(
    @Param('projectId') projectId: string,
    @Param('id') id: string,
    @Body() updateBidDto: UpdateBidDto,
    @Request() req,
  ) {
    const parsedProjectId = this.parseProjectId(projectId);
    const parsedId = this.parseProjectId(id);
    const bid = await this.bidsService.findOne(parsedId);

    if (bid.projectId !== parsedProjectId) {
      throw new ForbiddenException('Bid does not belong to this project');
    }

    return this.bidsService.update(parsedId, updateBidDto, req.user.userId);
  }

  @Delete(':id')
  async remove(
    @Param('projectId') projectId: string,
    @Param('id') id: string,
    @Request() req,
  ) {
    const parsedProjectId = this.parseProjectId(projectId);
    const parsedId = this.parseProjectId(id);
    const bid = await this.bidsService.findOne(parsedId);

    if (bid.projectId !== parsedProjectId) {
      throw new ForbiddenException('Bid does not belong to this project');
    }

    return this.bidsService.remove(parsedId, req.user.userId);
  }

  @Post(':id/accept')
  async acceptBid(
    @Param('projectId') projectId: string,
    @Param('id') id: string,
    @Request() req,
  ) {
    const parsedProjectId = this.parseProjectId(projectId);
    const parsedId = this.parseProjectId(id);
    const project = await this.projectsService.findOne(parsedProjectId.toString());

    if (project.clientId !== req.user.userId) {
      throw new ForbiddenException('You do not have permission to accept this bid');
    }

    return this.bidsService.acceptBid(parsedId, req.user.userId, parsedProjectId);
  }
}