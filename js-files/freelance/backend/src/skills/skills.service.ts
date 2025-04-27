import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Skill } from 'src/entities/skill.entity';
import { Injectable } from '@nestjs/common';
import { CreateSkillDto, UpdateSkillDto } from 'src/dtos/skill.dto';

@Injectable()
export class SkillsService {
  constructor(
    @InjectRepository(Skill)
    private readonly skillRepository: Repository<Skill>,
  ) {}

  async create(createSkillDto: CreateSkillDto): Promise<Skill> {
    const skill = this.skillRepository.create(createSkillDto);
    return await this.skillRepository.save(skill);
  }

  async findAll(): Promise<Skill[]> {
    return await this.skillRepository.find();
  }

  async findOne(id: number): Promise<Skill> {
    const skill = await this.skillRepository.findOne({ where: { id } });
    if (!skill) {
      throw new Error(`Skill with id ${id} not found`);
    }
    return skill;
  }

  async update(id: number, updateSkillDto: UpdateSkillDto): Promise<Skill> {
    await this.skillRepository.update(id, updateSkillDto);
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.skillRepository.delete(id);
  }
}
