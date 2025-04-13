import { Controller, Post, Body, Headers, HttpException, HttpStatus } from '@nestjs/common';
import { EmploymentDto } from './dto/employment.dto';
import { EmploymentValidator } from './validators/employment.validator';

@Controller('employment')
export class EmploymentController {
  constructor(private readonly employmentValidator: EmploymentValidator) {}

  @Post()
  createEmployment(@Body() employmentDto: EmploymentDto, @Headers('X-Country-Code') countryCode: string): any {
    const validationErrors = this.employmentValidator.validateEmployment(employmentDto, countryCode);
    
    if (validationErrors) {
      throw new HttpException(validationErrors, HttpStatus.BAD_REQUEST);
    }
    

    return {
      success: true,
      message: 'Employment created successfully',
      data: employmentDto
    };
  }
}