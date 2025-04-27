import { IsNumber, IsString, IsEnum, IsDate, IsOptional } from 'class-validator';
import { MilestoneStatus } from '../enums/allEnums';
import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';

export class CreateMilestoneDto {
  @IsNumber()
  projectId: number;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsNumber()
  amount: number;

  @IsDate()
  @Type(()=>Date)
  dueDate: Date;

  @IsEnum(MilestoneStatus)
  @IsOptional()
  status?: MilestoneStatus;
}

export class UpdateMilestoneDto extends PartialType(CreateMilestoneDto) {}