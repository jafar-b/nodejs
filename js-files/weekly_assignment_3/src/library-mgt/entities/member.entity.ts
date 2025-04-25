import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';
import { BorrowRecord } from './borrowRecord.entity';
import { IsNotEmpty, IsEmail, Matches } from 'class-validator';

@Entity()
export class Member {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @Column()
  @IsEmail({}, { message: 'Invalid email address' }) // Validate email format
  email: string;

  @Column()
  @Matches(/^[0-9]{10}$/, { message: 'Phone number must be 10 digits' }) // Validate phone number format
  phone: string;

  @Column({ nullable: true })
  address?: string;

  @Column({ nullable: true })
  dateOfBirth?: Date;

  @OneToMany(()=>BorrowRecord,(borrowRecord)=>borrowRecord.member)
  borrowRecords: BorrowRecord[];
}
 