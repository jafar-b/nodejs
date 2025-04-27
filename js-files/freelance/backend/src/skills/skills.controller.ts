import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { SkillsService } from './skills.service';
import { CreateSkillDto, UpdateSkillDto } from 'src/dtos/skill.dto';

@Controller('skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Post()
  async create(@Body() createSkillDto: CreateSkillDto) {
    try {
      return await this.skillsService.create(createSkillDto);
    } catch (error) {
      throw new HttpException('Skill creation failed', HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  async findAll() {
    return await this.skillsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const skill = await this.skillsService.findOne(+id);
    if (!skill) {
      throw new HttpException('Skill not found', HttpStatus.NOT_FOUND);
    }
    return skill;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateSkillDto: UpdateSkillDto) {
    const skill = await this.skillsService.update(+id, updateSkillDto);
    if (!skill) {
      throw new HttpException('Skill update failed', HttpStatus.NOT_FOUND);
    }
    return skill;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const skill = await this.skillsService.findOne(+id);
    if (!skill) {
      throw new HttpException('Skill not found', HttpStatus.NOT_FOUND);
    }
    await this.skillsService.remove(+id);
    return { message: 'Skill successfully deleted' };
  }
}
