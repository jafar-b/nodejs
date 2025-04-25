import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBookDto } from './dto/book/create-book.dto';
import { UpdateBookDto } from './dto/book/update-book.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { IsNull, LessThan, Repository } from 'typeorm';
import { Author } from './entities/author.entity';
import { Member } from './entities/member.entity';
import { CreateMemberDto } from './dto/member/create-member.dto';
import { BorrowRecord } from './entities/borrowRecord.entity';

@Injectable()
export class LibraryMgtService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    @InjectRepository(Author)
    private readonly authorRepository: Repository<Author>,
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
    @InjectRepository(BorrowRecord)
    private readonly borrowRecordRepository: Repository<BorrowRecord>,
  ) {}

  get availableBooks(): Promise<Book[]> {
    return this.bookRepository
      .createQueryBuilder('book')
      .where('book.available > 0') // Fetch books with available copies
      .getMany();
  }

  get borrowedBooks(): Promise<Book[]> {
    return this.bookRepository
      .createQueryBuilder('book')
      .where('book.available = 0') // Fetch books where available copies are less than total quantity
      .getMany();
  }

  // Create a new book
  async create(createBookDto: CreateBookDto): Promise<Book> {
    if (createBookDto.available > createBookDto.quantity) {
      throw new BadRequestException(
        'Available copies cannot exceed the total quantity',
      );
    }

    const newBook = this.bookRepository.create(createBookDto);
    return await this.bookRepository.save(newBook);
  }

  // Find all books
  async findAllBooks(): Promise<Book[]> {
    return await this.bookRepository.find();
  }

  // Find all authors
  async findAllAuthors(): Promise<Author[]> {
    return await this.authorRepository.find();
  }

  // Borrow a book
  async borrowBook(bookId: number): Promise<Book> {
    const book = await this.findOne(bookId);

    await this.bookRepository
      .createQueryBuilder('book')
      .update(Book)
      .set({ available: book.available - 1 }) // Decrease available count
      .where('id = :id', { id: bookId })
      .execute();

    return await this.findOne(bookId); // Return the updated book
  }

  // Return a book
  async returnBook(bookId: number): Promise<Book> {
    const book = await this.findOne(bookId);

    if (book.available >= book.quantity) {
      throw new BadRequestException(
        'Available copies cannot exceed the total quantity',
      );
    }

    await this.bookRepository
      .createQueryBuilder('book')
      .update(Book)
      .set({ available: book.available + 1 }) // Increase available count
      .where('id = :id', { id: bookId })
      .execute();

    return await this.findOne(bookId); // Return the updated book
  }

  // Find a single book by ID
  async findOne(id: number): Promise<Book> {
    const book = await this.bookRepository.findOne({ where: { id } });
    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    return book;
  }

  // Update a book by ID
  async update(id: number, updateBookDto: UpdateBookDto): Promise<Book> {
    const book = await this.findOne(id);

    if (
      updateBookDto.available !== undefined &&
      updateBookDto.quantity !== undefined &&
      updateBookDto.available > updateBookDto.quantity
    ) {
      throw new BadRequestException(
        'Available copies cannot exceed the total quantity',
      );
    }

    Object.assign(book, updateBookDto);
    return await this.bookRepository.save(book);
  }

  // Remove a book by ID
  async remove(id: number): Promise<void> {
    const book = await this.findOne(id);
    await this.bookRepository.remove(book);
  }

  // Register a new member
  async registerMember(createMemberDto: CreateMemberDto) {
    const newMember = this.memberRepository.create(createMemberDto);
    return await this.memberRepository.save(newMember);
  }

async findBorrowRecords(){
  return this.borrowRecordRepository.find()
}

async findOverdue(){
  const currentDate = new Date();
  return this.borrowRecordRepository.find({
    where: [
      {
        returnDate: IsNull(), // Book has not been returned
        dueDate: LessThan(currentDate), // Due date has passed
      },
      {
        returnDate: LessThan(new Date(currentDate.getTime() - 14 * 24 * 60 * 60 * 1000)), // Returned after 14 days
      },
    ],
    relations: ['book', 'member'],
  });

}


}
