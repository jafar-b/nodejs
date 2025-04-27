import { IsString, IsNumber, IsOptional, IsDate, IsEnum } from 'class-validator';
import { InvoiceStatus } from '../enums/allEnums';
import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';

export class CreateInvoiceDto {
  @IsNumber()
  projectId: number;

  @IsNumber()
  milestoneId: number;

  @IsString()
  invoiceNumber: string;

  @IsNumber()
  amount: number;

  @IsNumber()
  taxAmount: number;

  @IsNumber()
  totalAmount: number;

  @IsEnum(InvoiceStatus)
  status: InvoiceStatus;

  @IsDate()
  @Type(()=>Date)
  dueDate: Date;

  @IsString()
  @IsOptional()
  paymentMethod?: string;

  @IsString({ each: true })
  @IsOptional()
  attachments?: string[];
}

export class UpdateInvoiceDto extends PartialType(CreateInvoiceDto) {}