import { Module } from '@nestjs/common';
import { LibraryMgtService } from './library-mgt.service';
import { LibraryMgtController } from './library-mgt.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { Author } from './entities/author.entity';
import { Member } from './entities/member.entity';
import { QuantityCheckPipe } from 'src/library-mgt/quantity-check/quantity-check.pipe';
import { BorrowRecord } from './entities/borrowRecord.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Book,Author,Member,BorrowRecord]), 
  ],
  controllers: [LibraryMgtController],
  providers: [LibraryMgtService,QuantityCheckPipe],
})
export class LibraryMgtModule {}
