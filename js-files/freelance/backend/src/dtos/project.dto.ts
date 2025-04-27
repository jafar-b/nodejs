import { IsNumber, IsString, IsEnum, IsArray, IsDate, IsOptional } from 'class-validator';
import { ProjectStatus, PaymentType, ProjectVisibility } from '../enums/allEnums';
import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';

export class CreateProjectDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsNumber()
  clientId: number;

  @IsOptional()
  @IsNumber()
  assignedFreelancerId?: number;

  @IsEnum(ProjectStatus)
  @IsOptional()
  status?: ProjectStatus;

  @IsNumber()
  budget: number;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  deadline?: Date;

  @IsEnum(PaymentType)
  paymentType: PaymentType;

  @IsNumber()
  categoryId: number;

  @IsEnum(ProjectVisibility)
  @IsOptional()
  visibility?: ProjectVisibility;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  attachments?: string[];
}

export class UpdateProjectDto extends PartialType(CreateProjectDto) {}