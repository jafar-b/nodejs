import { IsString, IsEmail, IsEnum, IsBoolean, IsOptional } from 'class-validator';
import { UserRole, UserStatus } from '../enums/allEnums';
import { PartialType } from '@nestjs/mapped-types';

export class CreateUserDto {
  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  passwordHash: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEnum(UserRole)
  role: UserRole;

  @IsBoolean()
  @IsOptional()
  isVerified?: boolean;

  @IsEnum(UserStatus)
  @IsOptional()
  status?: UserStatus;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}