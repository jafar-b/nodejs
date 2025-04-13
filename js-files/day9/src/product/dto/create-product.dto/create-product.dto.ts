import {
  IsString,
  IsOptional,
  IsNotEmpty,
  Min,
  MinLength,
  IsNumber,
  IsArray,
  isNumber,
} from 'class-validator';

export class CreateProductDto {
    @IsOptional()
    @IsNumber()
    id:number;


  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNumber()  
  @Min(1)
  price: number;


  @IsOptional()
  @IsArray()
  @MinLength(2, { each: true })
  tags?: string[];


}
