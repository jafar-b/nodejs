import { Injectable, NotFoundException } from '@nestjs/common';

import * as bcrypt from 'bcrypt';
import { User } from 'src/entities/user.entity';
import { UserRole } from 'src/enums/allEnums';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto, UpdateUserDto } from 'src/dtos/user.dto';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async create(userDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(userDto.passwordHash, 10);
    const newUser = this.userRepo.create({
      ...userDto,
      passwordHash: hashedPassword,
      refreshToken: undefined,
      role: UserRole.CLIENT,
    });

    const savedUser = await this.userRepo.save(newUser);
    return this.sanitizeUser(savedUser);
  }

  async findAll() {
    const clients = await this.userRepo.find({
      where: { role: UserRole.CLIENT },
    });
    return clients.map((client) => this.sanitizeUser(client));
  }

  async findOne(id: string) {
    const user = await this.userRepo.findOne({
      where: { id: +id, role: UserRole.CLIENT },
    });

    if (!user) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }
    return this.sanitizeUser(user);
  }
  async findByEmail(email: string, includeSensitiveFields = false) {
    const selectFields = includeSensitiveFields
      ? {
          id: true,
          email: true,
          passwordHash: true,
          firstName: true,
          lastName: true,
          role: true,
          phoneNumber: true,
          createdAt: true,
          updatedAt: true,
          isVerified: true,
          verificationToken: true,
          refreshToken: true,
        }
      : {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          phoneNumber: true,
          createdAt: true,
          updatedAt: true,
          isVerified: true,
          verificationToken: true,
        };

    const user = await this.userRepo.findOne({
      where: { email, role: UserRole.CLIENT },
      
    });

    return user || null;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepo.findOne({
      where: { id: +id, role: UserRole.CLIENT },
    });

    if (!user) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }

    if (updateUserDto.passwordHash) {
      updateUserDto.passwordHash = await bcrypt.hash(
        updateUserDto.passwordHash,
        10,
      );
    }

    Object.assign(user, updateUserDto);
    const updatedUser = await this.userRepo.save(user);
    return this.sanitizeUser(updatedUser);
  }

  async updateRefreshToken(id: string, refreshToken: string) {
    const user = await this.userRepo.findOne({
      where: { id: +id, role: UserRole.CLIENT },
    });

    if (!user) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }

    user.refreshToken = refreshToken;
    await this.userRepo.save(user);
    return { success: true };
  }

  async remove(id: string) {
    const result = await this.userRepo.delete({
      id: +id,
      role: UserRole.CLIENT,
    });

    if (result.affected === 0) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }

    return { success: true };
  }

  public sanitizeUser(user: User) {
    const { passwordHash, refreshToken, ...result } = user;
    return result;
  }
}
