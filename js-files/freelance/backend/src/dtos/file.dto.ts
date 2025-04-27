import { IsNumber, IsString, IsEnum, IsUrl, IsOptional } from 'class-validator';
import { FileType } from '../enums/allEnums';
import { PartialType } from '@nestjs/mapped-types';

export class CreateFileDto {
  @IsNumber()
  @IsOptional()
  project_id?: number;

  @IsNumber()
  @IsOptional()
  user_id?: number;

  @IsString()
  name: string;

  @IsString()
  original_name: string;

  @IsEnum(FileType)
  type: FileType;

  @IsString()
  mime_type: string;

  @IsNumber()
  size: number;

  @IsUrl()
  url: string;
}

export class UpdateFileDto extends PartialType(CreateFileDto) {}