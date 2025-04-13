import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentService } from './payment.service';
import { OrdersService } from '../orders/orders.service'; // Ensure correct import path
import { CartService } from 'src/cart/cart.service';

@Controller('payment')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly ordersService: OrdersService, 
    private readonly cartService:CartService, 

  ) {}

  @Get()
  getPayment() {
    return {
      payment: this.paymentService.getAllPayments(),
      orders: this.ordersService.findAll(),
    };
  }

  @Post()
  createPayment(@Body() paymentDto: CreatePaymentDto) {
    return this.paymentService.create(paymentDto);
  }
  

  @Post('/make-payment/:id')
  confirmPayment(@Param('id') id: string) {
    const numericId = +id; 
    const removedCart = this.cartService.remove(numericId);
    const paymentRecord = this.paymentService.makePayment(numericId);
    const orderRecord = this.ordersService.confirmOrder(numericId);
    return {
      message: 'Payment and order confirmed successfully',
      removedCart,
      paymentRecord,
      orderRecord,
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paymentService.remove(+id); 
  }
}
