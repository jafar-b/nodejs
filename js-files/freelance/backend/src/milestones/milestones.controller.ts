import { Controller, Get, Post, Body, Patch, Param, Delete, Request } from '@nestjs/common';
import { MilestonesService } from './milestones.service';
import { CreateMilestoneDto, UpdateMilestoneDto } from 'src/dtos/milestone.dto';

import { Roles } from '../auth/decorators/roles.decorator';

@Controller('milestones')
export class MilestonesController {
  constructor(private readonly milestonesService: MilestonesService) {}

  @Post()
  @Roles('client')
  create(@Body() createMilestoneDto: CreateMilestoneDto, @Request() req) {
    return this.milestonesService.create(createMilestoneDto, req.user.userId);
  }

  @Get()
  @Roles('client', 'freelancer')
  findAll() {
    return this.milestonesService.findAll();
  }

  @Get('project/:projectId')
  @Roles('client', 'freelancer')
  findAllByProject(@Param('projectId') projectId: string) {
    return this.milestonesService.findAllByProject(projectId);
  }

  @Get('client')
  @Roles('client')
  findAllByClient(@Request() req) {
    return this.milestonesService.findAllByClient(req.user.userId);
  }

  @Get(':id')
  @Roles('client', 'freelancer')
  findOne(@Param('id') id: string) {
    return this.milestonesService.findOne(id);
  }

  @Patch(':id')
  @Roles('client', 'freelancer')
  update(
    @Param('id') id: string, 
    @Body() updateMilestoneDto: UpdateMilestoneDto,
    @Request() req,
  ) {
    return this.milestonesService.update(
      id, 
      updateMilestoneDto, 
      req.user.userId,
      req.user.role,
    );
  }

  @Delete(':id')
  @Roles('client')
  remove(@Param('id') id: string, @Request() req) {
    return this.milestonesService.remove(
      id, 
      req.user.userId,
      req.user.role,
    );
  }

  @Post(':id/release-payment')
  @Roles('client')
  releaseMilestonePayment(
    @Param('id') id: string,
    @Request() req,
  ) {
    return this.milestonesService.releaseMilestonePayment(
      id,
      req.user.userId,
    );
  }

  @Post(':id/complete')
  @Roles('freelancer')
  completeMilestone(
    @Param('id') id: string,
    @Request() req,
  ) {
    return this.milestonesService.completeMilestone(
      id,
      req.user.userId,
    );
  }
}