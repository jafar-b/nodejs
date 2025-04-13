import { Injectable } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { log } from 'console';
import { PaymentService } from '../payment/payment.service';
import { CartNotFoundException } from 'src/exceptions/CartNotFound.exception';
import { InsufficientStockException } from 'src/exceptions/insufficient-stock.exception';

@Injectable()
export class CartService {
  constructor(private paymentService: PaymentService) {}
  private AVAILABLE_STOCK_QUANTITY = 10;

  cart = [
    {
      cartId: 1,
      name: 'Laptop',
      quantity: 1,
      price: 499,
    },
    {
      cartId: 2,
      name: 'Washing Machine',
      quantity: 2,
      price: 999,
    },
    {
      cartId: 3,
      name: 'Smartphone',
      quantity: 3,
      price: 299,
    },
    {
      cartId: 4,
      name: 'Headphones',
      quantity: 2,
      price: 99,
    },
  ];

  create(createCartDto: CreateCartDto) {
    if (createCartDto.quantity > this.AVAILABLE_STOCK_QUANTITY)
      throw new InsufficientStockException();
    this.cart.push(createCartDto);
    return createCartDto;
  }

  findAll() {
    log('Your Cart is: ', this.cart);
    return this.cart;
  }

  remove(id: number) {  
    const index = this.cart.findIndex((item) => item.cartId === id);
    if (index === -1) {
      throw new CartNotFoundException(id); // Throw exception if cart not found
    }
    const removedCart = this.cart.splice(index, 1)[0]; // Remove the cart item
    return removedCart;   }

  findOne(id: number) {
    const cart = this.cart.find((item) => item.cartId == id);
    if (!cart || cart == null) {
      throw new CartNotFoundException(id);
    }
  }
}
