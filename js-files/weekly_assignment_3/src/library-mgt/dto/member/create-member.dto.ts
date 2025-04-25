import { IsNotEmpty, IsEmail, Matches } from "class-validator";

export class CreateMemberDto {
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsEmail({}, { message: 'Invalid email address' })
  email: string;

  @Matches(/^[0-9]{10}$/, { message: 'Phone number must be 10 digits' })
  phone: string;

  address?: string;

  dateOfBirth?: Date;
  }