import { Module } from '@nestjs/common';
import { EmploymentController } from './employment.controller';
import { EmploymentValidator } from './validators/employment.validator';

@Module({
  controllers: [EmploymentController],
  providers: [EmploymentValidator],
})
export class EmploymentModule {}