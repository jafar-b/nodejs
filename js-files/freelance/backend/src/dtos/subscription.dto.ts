import { IsNumber, IsString, IsEnum, IsDate, IsOptional } from 'class-validator';
import { SubscriptionStatus, SubscriptionPlan } from '../enums/allEnums';

export class CreateSubscriptionDto {
  @IsNumber()
  user_id: number;

  @IsEnum(SubscriptionPlan)
  type: SubscriptionPlan;

  @IsNumber()
  amount: number;

  @IsDate()
  start_date: Date;

  @IsDate()
  end_date: Date;

  @IsEnum(SubscriptionStatus)
  @IsOptional()
  status?: SubscriptionStatus;
}

export class UpdateSubscriptionDto {
  @IsEnum(SubscriptionPlan)
  @IsOptional()
  type?: SubscriptionPlan;

  @IsNumber()
  @IsOptional()
  amount?: number;

  @IsDate()
  @IsOptional()
  end_date?: Date;

  @IsEnum(SubscriptionStatus)
  @IsOptional()
  status?: SubscriptionStatus;

  @IsDate()
  @IsOptional()
  cancelled_at?: Date;
}