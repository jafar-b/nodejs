import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { PaymentService } from '../payment/payment.service';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService,private paymentService:PaymentService) {}

  @Post("/")
  create(@Body() createCartDto: CreateCartDto) {
    return this.cartService.create(createCartDto);
  }

  @Get()
  getAllCarts() {
    return this.cartService.findAll();
  }

  // @Post("make-payment/:cartId")
  // makePayment(@Param('cartId') cartId:number)
  // {
  //   return this.cartService.makePayment(cartId)
  // }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cartService.findOne(+id);
  }


  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cartService.remove(+id);
  }
}
