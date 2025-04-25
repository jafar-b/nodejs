import { NotFoundException } from '@nestjs/common';

export class BookNotAvailableException extends NotFoundException {
  constructor() {
    super('Book not available');
  }
}
