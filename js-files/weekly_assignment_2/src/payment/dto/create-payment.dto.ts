import {
    IsInt,
    IsPositive,
    IsNumber,
    IsEnum,
    IsDateString,
  } from 'class-validator';
  
  export enum PaymentMethod {
    UPI = 'upi',
    CREDIT_CARD = 'credit_card',
    CASH_ON_DELIVERY = 'cash_on_delivery',
  }
  
  export enum PaymentStatus {
    SUCCESS = 'success',
    FAILED = 'failed',
    PENDING = 'pending',
  }
  
  export class CreatePaymentDto {
    @IsInt()
    @IsPositive()
    id: number;
  
    @IsInt()
    @IsPositive()
    userId: number;
  
    @IsInt()
    @IsPositive()
    cartId: number;
  
    @IsNumber()
    @IsPositive()
    amount: number;
  
    @IsEnum(PaymentMethod)
    method: PaymentMethod;
  
    @IsEnum(PaymentStatus)
    status: PaymentStatus;
  
    @IsDateString()
    timestamp: string;
  }
  