import { HttpException, HttpStatus } from '@nestjs/common';

export class InsufficientStockException extends HttpException {
  constructor(message: string = 'Insufficient stock ') {
    super({ message }, HttpStatus.BAD_REQUEST);
  }
}
