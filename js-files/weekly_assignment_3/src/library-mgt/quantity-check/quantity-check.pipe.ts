import {
  Injectable,
  PipeTransform,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BookNotAvailableException } from 'src/library-mgt/custom-exceptions/book-not-available.exception';
import { Book } from 'src/library-mgt/entities/book.entity';
import { Repository } from 'typeorm';

@Injectable()
export class QuantityCheckPipe implements PipeTransform<number> {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
  ) {}

  async transform(bookId: number): Promise<number> {
    // Fetch the book from the database
    const book = await this.bookRepository.findOne({ where: { id: bookId } });

    if (!book) {
      throw new NotFoundException(`Book with ID ${bookId} not found`);
    }

    // Check if the available quantity is greater than 0
    if (book.available <= 0) {
      throw new BookNotAvailableException();
    }

    // Return the bookId if validation passes
    return bookId;
  }
}