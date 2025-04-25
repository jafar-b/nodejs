import { IsNumber, IsString } from "class-validator";

export class CreateBookDto {
    @IsString()
    name: string;
    @IsNumber()
    isbn: number;
    @IsNumber()
    quantity: number;
    @IsNumber()
    author_id: number; // Assuming the author is referenced by ID
    @IsNumber()
    available: number; 
    @IsNumber()
    price: number; 
  }