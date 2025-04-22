import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { PaymentController } from '../payment/payment.controller';
import { PaymentService } from '../payment/payment.service';

@Module({

  controllers: [CartController,],
  providers: [CartService,PaymentService],
  exports:[CartService]
})
export class CartModule {}
