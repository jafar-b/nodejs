// src/user/user.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User} from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getUsersFilteredSortedPaginated(
    nameFilter: string,
    page: number,
    limit: number,
  ) {
    return this.userRepository
    .createQueryBuilder('user')
    .leftJoinAndSelect('user.profile', 'profile') // Ensure 'user.profile' matches the relation in the User entity
    .where('user.name LIKE :name', { name: `%${nameFilter}%` }) // Filtering
    .orderBy('user.name', 'ASC') // Single sorting
    .addOrderBy('profile.type', 'DESC') // Relational sorting 
    .skip((page - 1) * limit) // Pagination
    .take(limit)
    .getMany();
  }
}
