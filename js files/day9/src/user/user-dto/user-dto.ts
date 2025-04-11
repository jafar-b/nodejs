
import { Transform } from 'class-transformer';
import {IsNumber,IsEmail,  IsInt} from 'class-validator'

export class UserDto {

    @Transform(({value})=>value.trim().toLowerCase())    
    @IsEmail()
    email: string;

    @Transform(({value})=>parseInt(value))
    @IsInt()
    age: number;
  

}
