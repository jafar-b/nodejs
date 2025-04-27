import { IsNumber, IsString, IsEnum, IsOptional } from 'class-validator';
import { NotificationType } from '../enums/allEnums';
import { PartialType } from '@nestjs/mapped-types';

export class CreateNotificationDto {
  @IsNumber()
  user_id: number;

  @IsString()
  title: string;

  @IsString()
  message: string;

  @IsEnum(NotificationType)
  type: NotificationType;

  @IsString()
  @IsOptional()
  link?: string;
}

export class UpdateNotificationDto extends PartialType(CreateNotificationDto) {}