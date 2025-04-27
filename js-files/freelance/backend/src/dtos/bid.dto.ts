import { IsNumber, IsString, IsEnum, IsOptional } from 'class-validator';
import { BidStatus } from '../enums/allEnums';
import { PartialType } from '@nestjs/mapped-types';

export class CreateBidDto {
  @IsNumber()
  project_id: number;

  @IsNumber()
  freelancer_id: number;

  @IsNumber()
  amount: number;

  @IsNumber()
  estimated_days: number;

  @IsString()
  proposal: string;

  @IsEnum(BidStatus)
  @IsOptional()
  status?: BidStatus;
}

export class UpdateBidDto extends PartialType(CreateBidDto) {}