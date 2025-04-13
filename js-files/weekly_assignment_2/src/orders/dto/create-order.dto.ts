import { IsInt, IsPositive, IsDateString } from 'class-validator';

export class CreateOrderDto {
  @IsInt()
  id: number;

  @IsInt()
  userId: number;

  @IsInt()
  cartId: number;

  @IsPositive()
  totalAmount: number;

  status: string;

  @IsInt()
  paymentId: number;

  @IsDateString()
  createdAt: string;
}
