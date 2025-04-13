import { IsIn, IsString, Length, Validate } from 'class-validator';
import { PostalValidator } from 'src/user/validators/postal-validator.validator';


export class AddressDto {
  @IsString()
  @Length(5, 100)
  street: string;
    @IsString()
    @IsIn(["US", "UK", "IN"], { message: 'Invalid country code' }) 
    country: string;
  @Validate(PostalValidator)
  postalCode: string;
}
