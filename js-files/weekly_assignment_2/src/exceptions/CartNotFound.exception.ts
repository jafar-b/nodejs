import { HttpException, HttpStatus } from '@nestjs/common';

export class CartNotFoundException extends HttpException {
  constructor(cartId: number) {
    super(
      {
        message: `Cart with ID ${cartId} not found`,
      },
      HttpStatus.NOT_FOUND,
    );
  }
}