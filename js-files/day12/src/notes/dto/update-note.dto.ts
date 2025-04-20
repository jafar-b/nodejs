import { PartialType } from '@nestjs/mapped-types';
import { CreateNoteDto } from './create-note.dto';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateNoteDto extends PartialType(CreateNoteDto) {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsString()
  title?: string | undefined;

  @IsString()
  body?: string | undefined;
}
