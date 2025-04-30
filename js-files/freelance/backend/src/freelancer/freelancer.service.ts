import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { CreateUserDto, UpdateUserDto } from 'src/dtos/user.dto';
import { UserRole } from 'src/enums/allEnums';
import * as bcrypt from 'bcrypt';
import { log } from 'console';

@Injectable()
export class FreelancerService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.passwordHash, 10);
    const newUser = this.userRepo.create({
      ...createUserDto,
      passwordHash: hashedPassword,
      refreshToken: null,
      role: UserRole.FREELANCER,
    });
    log(newUser)
    const savedUser = await this.userRepo.save(newUser);
    return this.sanitizeUser(savedUser);
  }

  async findAll() {
    const freelancers = await this.userRepo.find({
      where: { role: UserRole.FREELANCER },
    });
    return freelancers.map((freelancer) => this.sanitizeUser(freelancer));
  }

  async findOne(id: string) {
    const user = await this.userRepo.findOne({
      where: { id: +id, role: UserRole.FREELANCER },
      relations: ['profile', 'skills', 'skills.skill'],
    });

    if (!user) {
      throw new NotFoundException(`Freelancer with ID ${id} not found`);
    }
    return this.sanitizeUser(user);
  }

  async findByEmail(email: string) {
    const user = await this.userRepo.findOne({
      where: { email, role: UserRole.FREELANCER },
    });
    return user || null;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepo.findOne({
      where: { id: +id, role: UserRole.FREELANCER },
    });

    if (!user) {
      throw new NotFoundException(`Freelancer with ID ${id} not found`);
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

  async updateRefreshToken(id: string, refreshToken: string | null) {
    const user = await this.userRepo.findOne({
      where: { id: +id, role: UserRole.FREELANCER },
    });

    if (!user) {
      throw new NotFoundException(`Freelancer with ID ${id} not found`);
    }

    user.refreshToken = refreshToken;
    await this.userRepo.save(user);
    return { success: true };
  }

  async remove(id: string) {
    const result = await this.userRepo.delete({
      id: +id,
      role: UserRole.FREELANCER,
    });

    if (result.affected === 0) {
      throw new NotFoundException(`Freelancer with ID ${id} not found`);
    }

    return { success: true };
  }

  async getDashboardStats(userId: string) {
    const [activeBids, activeProjects, completedProjects, totalEarned, rating] = await Promise.all([
      // Active bids count
      this.userRepo
        .createQueryBuilder('user')
        .leftJoin('user.bids', 'bid')
        .where('user.id = :userId', { userId })
        .andWhere('bid.status = :status', { status: 'PENDING' })
        .getCount(),
      
      // Active projects count
      this.userRepo
        .createQueryBuilder('user')
        .leftJoin('user.freelancerProjects', 'project')
        .where('user.id = :userId', { userId })
        .andWhere('project.status = :status', { status: 'IN_PROGRESS' })
        .getCount(),
      
      // Completed projects count
      this.userRepo
        .createQueryBuilder('user')
        .leftJoin('user.freelancerProjects', 'project')
        .where('user.id = :userId', { userId })
        .andWhere('project.status = :status', { status: 'COMPLETED' })
        .getCount(),
      
      // Total earned
      this.userRepo
        .createQueryBuilder('user')
        .leftJoin('user.receivedPayments', 'payment')
        .where('user.id = :userId', { userId })
        .andWhere('payment.status = :status', { status: 'COMPLETED' })
        .select('SUM(payment.amount)', 'total')
        .getRawOne(),
      
      // Average rating
      this.userRepo
        .createQueryBuilder('user')
        .leftJoin('user.receivedReviews', 'review')
        .where('user.id = :userId', { userId })
        .select('AVG(review.rating)', 'average')
        .getRawOne(),
    ]);

    // Get current projects
    const currentProjects = await this.userRepo
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.freelancerProjects', 'project')
      .leftJoinAndSelect('project.category', 'category')
      .leftJoinAndSelect('project.milestones', 'milestone')
      .where('user.id = :userId', { userId })
      .andWhere('project.status = :status', { status: 'IN_PROGRESS' })
      .orderBy('project.updatedAt', 'DESC')
      .take(5)
      .getOne();

    // Get recent bids
    const recentBids = await this.userRepo
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.bids', 'bid')
      .leftJoinAndSelect('bid.project', 'project')
      .leftJoinAndSelect('project.category', 'category')
      .where('user.id = :userId', { userId })
      .orderBy('bid.createdAt', 'DESC')
      .take(5)
      .getOne();

    return {
      stats: {
        activeBids,
        activeProjects,
        completedProjects,
        totalEarned: totalEarned?.total || 0,
        rating: rating?.average || 0,
      },
      currentProjects: currentProjects?.freelancerProjects || [],
      recentBids: recentBids?.bids || [],
    };
  }

  private sanitizeUser(user: User) {
    const { passwordHash, refreshToken, ...result } = user;
    return result;
  }
}
