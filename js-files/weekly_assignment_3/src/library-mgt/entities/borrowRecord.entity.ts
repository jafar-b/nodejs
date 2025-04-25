import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Member } from './member.entity';
import { Book } from './book.entity';

@Entity()
export class BorrowRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Book, (book) => book.borrowRecords, { eager: true })
  book: Book;

  @ManyToOne(() => Member, (member) => member.borrowRecords, { eager: true })
  member: Member;

  @Column({ type: 'date' })
  borrowDate: Date;

  @Column({ type: 'datetime' })
  dueDate: Date;

  @Column({ type: 'datetime', nullable: true })
  returnDate?: Date;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ type: 'varchar', default: 'borrowed' })
  status: 'borrowed' | 'returned' ;
}  