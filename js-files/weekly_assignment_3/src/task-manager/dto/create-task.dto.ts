import { IsNotEmpty, IsString, IsOptional, IsEnum, IsDateString } from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional()
  status: string="TODO";

  @IsOptional()
  @IsDateString()
  dueDate?: Date;

  @IsOptional()
  priority?: string;

}
