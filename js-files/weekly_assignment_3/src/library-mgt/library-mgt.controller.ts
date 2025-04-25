import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { LibraryMgtService } from './library-mgt.service';
import { CreateBookDto } from './dto/book/create-book.dto';
import { UpdateBookDto } from './dto/book/update-book.dto';
import { Book } from './entities/book.entity';
import { CreateMemberDto } from './dto/member/create-member.dto';
import { QuantityCheckPipe } from 'src/library-mgt/quantity-check/quantity-check.pipe';

@Controller('library-mgt')
@UsePipes(new ValidationPipe({ transform: true, forbidNonWhitelisted: true }))
export class LibraryMgtController {
  constructor(private readonly libraryMgtService: LibraryMgtService) {}

  @Post('/books')
  create(@Body() createLibraryMgtDto: CreateBookDto) {
    return this.libraryMgtService.create(createLibraryMgtDto);
  }

  @Get('/books')
  findAll() {
    return this.libraryMgtService.findAllBooks();
  }

  @Get('/books/available')
  findAvailableBooks() {
    return this.libraryMgtService.availableBooks;
  }
  @Get('/books/borrowed')
  findBorrowedBooks() {
    return this.libraryMgtService.borrowedBooks;
  }

  @Get('/authors')
  findAllAuthors() {
    return this.libraryMgtService.findAllAuthors();
  }

  @Get('/borrow-records')
  findBorrowRecords() {
    return this.libraryMgtService.findBorrowRecords();
  }

  @Get('/reports/overdue')
  async findOverdueBooks() {
    return this.libraryMgtService.findOverdue();
  }

  @Post('/borrow/:id')
  borrowBook(@Param('id', QuantityCheckPipe) id: string) {
    return this.libraryMgtService.borrowBook(+id);
  }
  @Post('/return/:id')
  returnBook(@Param('id') id: string) {
    return this.libraryMgtService.returnBook(+id);
  }

  @Post('members')
  @UsePipes(new ValidationPipe({ transform: true }))
  registerMember(@Body() member: CreateMemberDto) {
    return this.libraryMgtService.registerMember(member);
  }
  @Get('book/:id')
  findOne(@Param('id') id: string) {
    return this.libraryMgtService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLibraryMgtDto: UpdateBookDto) {
    return this.libraryMgtService.update(+id, updateLibraryMgtDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.libraryMgtService.remove(+id);
  }

  @Post('/books')
  addBook(@Body() book: Book) {}
}
