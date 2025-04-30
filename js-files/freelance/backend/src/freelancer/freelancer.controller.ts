import { Controller, Get, Post, Body, Patch, Param, Delete, Request } from '@nestjs/common';
import { FreelancerService } from './freelancer.service';

import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateUserDto, UpdateUserDto } from 'src/dtos/user.dto';

@Controller('freelancer')
export class FreelancerController {
  constructor(private readonly freelancerService: FreelancerService) {}

  @Public()
  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.freelancerService.create(createUserDto);
  }

  @Get('profile')
  @Roles('freelancer')
  getProfile(@Request() req) {
    return this.freelancerService.findOne(req.user.userId);
  }

  @Get('dashboard')
  @Roles('freelancer')
  getDashboard(@Request() req) {
    return this.freelancerService.getDashboardStats(req.user.userId);
  }

  @Get()
  @Public()
  findAll() {
    return this.freelancerService.findAll();
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.freelancerService.findOne(id);
  }

  @Patch(':id')
  @Roles('freelancer')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.freelancerService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Roles('freelancer')
  remove(@Param('id') id: string) {
    return this.freelancerService.remove(id);
  }
}
