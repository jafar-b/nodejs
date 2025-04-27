import { IsNumber, IsString, IsUrl, IsArray, IsOptional } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateProfileDto {
  @IsNumber()
  user_id: number;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsNumber()
  @IsOptional()
  hourly_rate?: number;

  @IsUrl()
  @IsOptional()
  portfolio_url?: string;

  @IsString()
  @IsOptional()
  education?: string;

  @IsString()
  @IsOptional()
  experience?: string;

  @IsArray()
  @IsOptional()
  certificates?: string[];
}

export class UpdateProfileDto extends PartialType(CreateProfileDto) {}