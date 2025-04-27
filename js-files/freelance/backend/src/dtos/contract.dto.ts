import { IsNumber, IsString, IsEnum, IsDate, IsOptional } from 'class-validator';
import { ContractStatus } from '../enums/allEnums';
import { PartialType } from '@nestjs/mapped-types';

export class CreateContractDto {
  @IsNumber()
  project_id: number;

  @IsNumber()
  client_id: number;

  @IsNumber()
  freelancer_id: number;

  @IsString()
  terms: string;

  @IsEnum(ContractStatus)
  @IsOptional()
  status?: ContractStatus;

  @IsDate()
  start_date: Date;

  @IsDate()
  @IsOptional()
  end_date?: Date;
}

export class UpdateContractDto extends PartialType(CreateContractDto) {}