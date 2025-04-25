import { IsNotEmpty, IsString, IsEnum, MinLength, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional() 
  role: 'USER' | 'ADMIN' = 'USER'; 
}