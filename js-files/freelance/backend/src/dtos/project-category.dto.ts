import { IsString } from 'class-validator';

export class CreateProjectCategoryDto {
  @IsString()
  name: string;
}

export class UpdateProjectCategoryDto {
  @IsString()
  name: string;
}