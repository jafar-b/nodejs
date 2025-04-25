import { IsInt, IsDate, IsOptional, IsString, Min } from 'class-validator';

export class CreateBorrowRecordDto {
  @IsInt()
  @Min(1)
  bookId: number;

  @IsInt()
  @Min(1)
  memberId: number;

  @IsDate()
  borrowDate: Date;

  @IsDate()
  dueDate: Date;

  @IsOptional()
  @IsDate()
  returnDate?: Date;


  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  status?: 'borrowed' ;
}