import { IsIn, IsString, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { AddressDto } from './address.dto';
import { EducationDto } from './education.dto';

export class MainDto {
    @IsUUID()
    id: string;
  
    @ValidateNested()
    @Type(() => AddressDto)
    address: AddressDto;
  
    @ValidateNested({ each: true })
    @Type(() => EducationDto)
    education: EducationDto[];
}
