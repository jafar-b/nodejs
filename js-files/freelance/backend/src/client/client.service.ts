import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { CreateUserDto, UpdateUserDto } from 'src/dtos/user.dto';
import { UserRole } from 'src/enums/allEnums';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.passwordHash, 10);
    const newUser = this.userRepo.create({
      ...createUserDto,
      passwordHash: hashedPassword,
      refreshToken: null,
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
      relations: ['clientInfo', 'projects'],
    });

    if (!user) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }
    return this.sanitizeUser(user);
  }

  async findByEmail(email: string, includeSensitiveFields = false) {
    const user = await this.userRepo.findOne({
      where: { email, role: UserRole.CLIENT },
    });

    if (!user) {
      return null;
    }

    // return includeSensitiveFields ? user : this.sanitizeUser(user);
    return user;
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

  async getDashboardStats(userId: string) {
    const [activeProjects, completedProjects, pendingBids, totalSpent] = await Promise.all([
      // Active projects count
      this.userRepo
        .createQueryBuilder('user')
        .leftJoin('user.clientProjects', 'project')
        .where('user.id = :userId', { userId })
        .andWhere('project.status = :status', { status: 'IN_PROGRESS' })
        .getCount(),
      
      // Completed projects count
      this.userRepo
        .createQueryBuilder('user')
        .leftJoin('user.clientProjects', 'project')
        .where('user.id = :userId', { userId })
        .andWhere('project.status = :status', { status: 'COMPLETED' })
        .getCount(),
      
      // Pending bids count
      this.userRepo
        .createQueryBuilder('user')
        .leftJoin('user.clientProjects', 'project')
        .leftJoin('project.bids', 'bid')
        .where('user.id = :userId', { userId })
        .andWhere('bid.status = :status', { status: 'PENDING' })
        .getCount(),
      
      // Total spent
      this.userRepo
        .createQueryBuilder('user')
        .leftJoin('user.sentPayments', 'payment')
        .where('user.id = :userId', { userId })
        .andWhere('payment.status = :status', { status: 'COMPLETED' })
        .select('SUM(payment.amount)', 'total')
        .getRawOne(),
    ]);

    // Get recent projects
    const recentProjects = await this.userRepo
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.clientProjects', 'project')
      .leftJoinAndSelect('project.category', 'category')
      .leftJoinAndSelect('project.bids', 'bid')
      .leftJoinAndSelect('bid.freelancer', 'freelancer')
      .where('user.id = :userId', { userId })
      .orderBy('project.createdAt', 'DESC')
      .take(5)
      .getOne();

    // Get pending bids
    const pendingBidsList = await this.userRepo
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.clientProjects', 'project')
      .leftJoinAndSelect('project.bids', 'bid')
      .leftJoinAndSelect('bid.freelancer', 'freelancer')
      .where('user.id = :userId', { userId })
      .andWhere('bid.status = :status', { status: 'PENDING' })
      .orderBy('bid.createdAt', 'DESC')
      .take(5)
      .getOne();

    return {
      stats: {
        activeProjects,
        completedProjects,
        pendingBids,
        totalSpent: totalSpent?.total || 0,
      },
      recentProjects: recentProjects?.clientProjects || [],
      pendingBids: pendingBidsList?.clientProjects?.flatMap(p => p.bids) || [],
    };
  }

  private sanitizeUser(user: User) {
    const { passwordHash, refreshToken, ...result } = user;
    return result;
  }
}
