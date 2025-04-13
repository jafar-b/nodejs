import { HttpException, HttpStatus } from '@nestjs/common';

export class OrderAlreadyConfirmedException extends HttpException {
  constructor(orderId: number) {
    super(
      {
        message: `Order with ID ${orderId} is already confirmed`,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
