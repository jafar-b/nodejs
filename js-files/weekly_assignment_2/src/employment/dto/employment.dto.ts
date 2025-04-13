import { IsEnum, IsNotEmpty, IsDate, IsNumber, IsOptional, ValidateIf, ValidateNested, IsObject } from 'class-validator';
import { Type } from 'class-transformer';

export class FullTimeDetailsDto {
  @IsNotEmpty({ message: 'Benefits are required for full-time employees' })
  benefits: string[];

  @IsDate()
  @Type(() => Date)
  joiningDate: Date;
}

export class ContractorDetailsDto {
  @IsDate()
  @Type(() => Date)
  contractEnd: Date;

  @IsNumber()
  hourlyRate: number;
}

export class EmploymentDto {
  @IsEnum(['full-time', 'contractor'], { message: 'Employment type must be either full-time or contractor' })
  employmentType: 'full-time' | 'contractor';

  @ValidateIf(o => o.employmentType === 'full-time')
  @IsNotEmpty({ message: 'Full time details are required for full-time employment' })
  @ValidateNested()
  @Type(() => FullTimeDetailsDto)
  fullTimeDetails?: FullTimeDetailsDto;

  @ValidateIf(o => o.employmentType === 'contractor')
  @IsNotEmpty({ message: 'Contractor details are required for contractor employment' })
  @ValidateNested()
  @Type(() => ContractorDetailsDto)
  contractorDetails?: ContractorDetailsDto;

  @IsObject()
  metadata: Record<string, string>;
}