import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFreelancerDto } from './dto/create-freelancer.dto';
import { UpdateFreelancerDto } from './dto/update-freelancer.dto';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto, UpdateUserDto } from 'src/dtos/user.dto';
import { UserRole } from 'src/enums/allEnums';

@Injectable()
export class FreelancerService {
constructor(@InjectRepository(User)private readonly userRepo:Repository<User>){}

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.passwordHash, 10);
    const newFreelancer = this.userRepo.create({
      ...createUserDto,
      passwordHash: hashedPassword,
      refreshToken: null,
      role: UserRole.FREELANCER,
    });
    const savedFreelancer = await this.userRepo.save(newFreelancer);
    // return this.sanitizeFreelancer(savedFreelancer);
    return savedFreelancer;
  }

  async findAll() {
    const freelancers = await this.userRepo.find({ where: { role: UserRole.FREELANCER } });
    return freelancers.map((freelancer) => this.sanitizeFreelancer(freelancer));
  }

  async findOne(id: string) {
    const freelancer = await this.userRepo.findOne({ where: { id: +id, role: UserRole.FREELANCER } });
    if (!freelancer) {
      throw new NotFoundException(`Freelancer with ID ${id} not found`);
    }
    // return this.sanitizeFreelancer(freelancer);
    return freelancer;
  }

  async findByEmail(email: string) {
    const freelancer = await this.userRepo.findOne({ where: { email, role: UserRole.FREELANCER } });
    return freelancer || null;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const freelancer = await this.userRepo.findOne({ where: { id: +id, role: UserRole.FREELANCER } });
    if (!freelancer) {
      throw new NotFoundException(`Freelancer with ID ${id} not found`);
    }

    if (updateUserDto.passwordHash) {
      updateUserDto.passwordHash = await bcrypt.hash(updateUserDto.passwordHash, 10);
    }

    Object.assign(freelancer, updateUserDto);
    const updatedFreelancer = await this.userRepo.save(freelancer);
    // return this.sanitizeFreelancer(updatedFreelancer);
    return updatedFreelancer;
  }

  async updateRefreshToken(id: string, refreshToken: string | null) {
    const freelancer = await this.userRepo.findOne({ where: { id: +id, role: UserRole.FREELANCER } });
    if (!freelancer) {
      throw new NotFoundException(`Freelancer with ID ${id} not found`);
    }

    freelancer.refreshToken = refreshToken;
    await this.userRepo.save(freelancer);
    return { success: true };
  }

  async remove(id: string) {
    const result = await this.userRepo.delete({ id: +id, role: UserRole.FREELANCER });
    if (result.affected === 0) {
      throw new NotFoundException(`Freelancer with ID ${id} not found`);
    }
    return { success: true };
  }

  private sanitizeFreelancer(freelancer: any) {
    const { passwordHash, refreshToken, ...result } = freelancer;
    return result;
  }
}
