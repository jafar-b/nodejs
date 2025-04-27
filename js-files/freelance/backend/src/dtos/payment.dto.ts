import { IsNumber, IsString, IsEnum, IsOptional } from 'class-validator';
import { PaymentStatus, PaymentMethod } from '../enums/allEnums';
import { PartialType } from '@nestjs/mapped-types';

export class CreatePaymentDto {
  @IsNumber()
  invoice_id: number;

  @IsNumber()
  payer_id: number;

  @IsNumber()
  payee_id: number;

  @IsNumber()
  amount: number;

  @IsEnum(PaymentMethod)
  payment_method: PaymentMethod;

  @IsString()
  @IsOptional()
  transaction_id?: string;

  @IsEnum(PaymentStatus)
  @IsOptional()
  status?: PaymentStatus;
}

export class UpdatePaymentDto extends PartialType(CreatePaymentDto) {}