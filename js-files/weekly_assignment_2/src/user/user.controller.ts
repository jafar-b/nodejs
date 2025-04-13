import { Body, Controller, Post, UsePipes, ValidationPipe, BadRequestException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user-dto';
import { MainDto } from './dto/address-education.dto';


@Controller('users')
export class UsersController {
  @Post()
  @UsePipes(new ValidationPipe({
    exceptionFactory: (errors) => {
      const messages = errors.map(err => Object.values(err)).flat();
      return new BadRequestException({
        message: 'Validation failed',
        errors: messages
      });
    }
  }))
  createUser(@Body() userDto: CreateUserDto) {
    return { message: 'User created', data: userDto };
}

@Post('address-education')
@UsePipes(new ValidationPipe())
create(@Body() dto: MainDto) {            //combination of address and education DTO 
  return { message: 'Data submitted successfully', data: dto };
}


}
