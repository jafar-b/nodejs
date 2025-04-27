import { PartialType } from '@nestjs/mapped-types';
import { IsString } from 'class-validator';
import { Skill } from 'src/entities/skill.entity';

export class CreateSkillDto {
  @IsString()
  name: string;

  @IsString()
  category:string;

  @IsString()
  description:string;
}

export class UpdateSkillDto extends PartialType(Skill){
}