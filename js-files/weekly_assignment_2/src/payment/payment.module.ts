import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { OrdersModule } from '../orders/orders.module'; // Import OrdersModule
import { CartService } from 'src/cart/cart.service';

@Module({
  imports: [OrdersModule], // Import OrdersModule here
  controllers: [PaymentController],
  providers: [PaymentService,CartService],
})
export class PaymentModule {}
