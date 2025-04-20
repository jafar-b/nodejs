import { Injectable } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Note } from './entities/note.entity';
import { Repository } from 'typeorm';


@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note)
    private noteRepo: Repository<Note>,
  ) {}

  create(createNoteDto: CreateNoteDto) {
    return this.noteRepo.save(createNoteDto);
  }

  findAll() {
    return this.noteRepo.find();
  }

  findOne(id: number) {
    return this.noteRepo.findOneBy({ id });
  }

  update(id: number, updateNoteDto: UpdateNoteDto) {
    return this.noteRepo.update(id, updateNoteDto);
  }

  remove(id: number) {
    return this.noteRepo.delete(id);
  }
}
