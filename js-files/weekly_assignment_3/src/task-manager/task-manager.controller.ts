import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, UnauthorizedException, UsePipes, Query } from '@nestjs/common';
import { TaskManagerService } from './task-manager.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { AdminAuthGuard } from './admin-auth/admin-auth.guard';
import { JwtAuthGuard } from './jwt-user-auth/jwt-user-auth.guard';
import { log } from 'console';
import { CreateUserDto } from './dto/create-user.dto';
import { StatusValidationPipe } from './status-validation/status-validation.pipe';

@Controller('task-manager')

export class TaskManagerController {
  constructor(private readonly taskManagerService: TaskManagerService) {}


  @Post("login")
  login(@Body() createUserDto: CreateUserDto) {
    return this.taskManagerService.login(createUserDto);
  }



  @Patch('update-status')
  @UsePipes(StatusValidationPipe) 
  async updateTaskStatus(@Body()updateTaskDto:UpdateTaskDto) {

    return this.taskManagerService.updateTaskStatus(updateTaskDto);
  }


 @Get('tasks/mine')
@UseGuards(JwtAuthGuard) 
async findTasksByUser(@Req() req: any) {
  console.log('User from JWT:', req.user); 
  if (!req.user) {
    throw new UnauthorizedException('User not authenticated');
  }
  const userId = req.user.id; 
  return this.taskManagerService.findTasksByUser(userId);
}


  @Post("create-task")
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.taskManagerService.createTask(createTaskDto);
  }
  


  @Patch()
  @UseGuards(JwtAuthGuard) 
  async updateTask(
    @Body() updateTaskDto: UpdateTaskDto,
    @Req() req: any, 
  ) {
    const userId = req.user.id; 
    return this.taskManagerService.updateTask(updateTaskDto, userId);
  }



  @Get('task-search')
  async searchTasks(@Query('search') search: string) {
    return this.taskManagerService.searchTasks(search);
  }


}
