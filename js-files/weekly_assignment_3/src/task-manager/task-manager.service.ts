import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Like, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TaskManagerService {
  constructor(
    @InjectRepository(Task) private readonly taskRepository: Repository<Task>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async searchTasks(search: string): Promise<Task[]> {
    if (!search) {
      return this.taskRepository.find();
    }

    return this.taskRepository.find({
      where: [
        { title: Like(`%${search}%`) },
        { description: Like(`%${search}%`) },
      ],
    });
  }

  async updateTaskStatus(updateTaskDto: UpdateTaskDto): Promise<Task> {
    const { id, status } = updateTaskDto;

    const task = await this.taskRepository.findOne({ where: { id } });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    task.status = status ?? task.status;
    return await this.taskRepository.save(task);
  }

  async findTasksByUser(userId: number): Promise<Task[]> {
    return this.taskRepository.find({
     
      select: [
        'id',
        'title',
        'description',
        'status',
        'createdAt',
        'updatedAt',
        'dueDate',
        'priority',
      ], // Select only necessary fields
    });
  }
  async login(createUserDto: CreateUserDto) {
    const { username, password } = createUserDto;

    const user = await this.userRepository.findOne({ where: { username } });

    if (!user || user.password !== password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { id: user.id, username: user.username };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }

  async createTask(createTaskDto: CreateTaskDto) {
    const newTask = this.taskRepository.create(createTaskDto);
    return await this.taskRepository.save(newTask);
  }

  async updateTask(
    updateTaskDto: UpdateTaskDto,
    userId: number,
  ): Promise<Task> {
    const { id } = updateTaskDto;

    const task = await this.taskRepository.findOne({ where: { id } });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    if (task.createdBy !== userId) {
      throw new ForbiddenException('You can only edit your own tasks');
    }

    Object.assign(task, updateTaskDto);
    return await this.taskRepository.save(task);
  }

  async removeTask(id: number): Promise<string> {
    const task = await this.taskRepository.findOne({ where: { id } });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    await this.taskRepository.remove(task);
    return `Task with ID ${id} has been successfully removed.`;
  }
}
