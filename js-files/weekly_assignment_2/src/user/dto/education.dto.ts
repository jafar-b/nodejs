import { IsIn, IsInt, Min, Max } from 'class-validator';

export class EducationDto {
  @IsIn(['BSc', 'MSc', 'PhD'])
  degree: string;

  @IsInt()
  @Min(1990)
  @Max(new Date().getFullYear())
  year: number;
}
