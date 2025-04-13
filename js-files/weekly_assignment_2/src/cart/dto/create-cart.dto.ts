import { IsInt, IsOptional, IsString, Min } from "class-validator";


export class CreateCartDto {

  @IsInt()  
  @IsOptional()
  cartId: number;
  
  @IsString()
  name: 'Laptop Sleeve';
  
  @IsInt()
  quantity: number;

  @Min(1)
  @IsInt()
  price: 499;
}
