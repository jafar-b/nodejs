import { Injectable } from '@nestjs/common';
import { EmploymentDto } from './dto/employment.dto';

@Injectable()
export class EmploymentService {
  create(createEmploymentDto: EmploymentDto) {
    return 'This action adds a new employment';
  }

  findAll() {
    return `This action returns all employment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} employment`;
  }

  remove(id: number) {
    return `This action removes a #${id} employment`;
  }
}
