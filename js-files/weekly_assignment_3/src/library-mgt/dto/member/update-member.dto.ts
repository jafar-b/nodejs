import { PartialType } from '@nestjs/mapped-types';
import { CreateBookDto } from '../book/create-book.dto';

export class updateBookDto extends PartialType(CreateBookDto) {}
