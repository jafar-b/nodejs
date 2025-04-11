import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('get-user/:userId')
  getUserById(@Param('userId') userId: number) {
    return this.userService.findUserById(userId);
  }

  @Post('create-user/')
  createUSer(@Body('name') name: string) {
    return this.userService.createUser(name);
  }

  @Put('update-user/:userId')
  updateUser(@Param('id') id: number, @Body('name') name: string) {
    return { message: `Updated user ${id} with name ${name}` };
  }

  @Delete('delete-user/:userId')
  deleteUser(@Param('userId') userId: number) {
    return { message: `Deleted user with id: ${userId}` };
  }
}
