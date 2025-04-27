import { IsNumber, Min, Max } from 'class-validator';

export class CreateUserSkillDto {
  @IsNumber()
  user_id: number;

  @IsNumber()
  skill_id: number;

  @IsNumber()
  @Min(1)
  @Max(5)
  proficiency_level: number;
}

export class UpdateUserSkillDto {
  @IsNumber()
  @Min(1)
  @Max(5)
  proficiency_level: number;
}