import { IsNumber, IsString, IsEnum, IsOptional } from 'class-validator';
import { DisputeStatus } from '../enums/allEnums';
import { PartialType } from '@nestjs/mapped-types';

export class CreateDisputeDto {
  @IsNumber()
  project_id: number;

  @IsNumber()
  reported_by: number;

  @IsNumber()
  reported_against: number;

  @IsString()
  reason: string;

  @IsString()
  description: string;

  @IsEnum(DisputeStatus)
  @IsOptional()
  status?: DisputeStatus;
}

export class UpdateDisputeDto extends PartialType(CreateDisputeDto) {}