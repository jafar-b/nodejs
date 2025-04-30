import { Controller, Get, Patch, Request, UseInterceptors, UploadedFile, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from '../auth/decorators/roles.decorator';
import { UpdateUserDto } from '../dtos/user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @Roles('client', 'freelancer') 
  getProfile(@Request() req) {
    return this.userService.getProfile(req.user.userId);
  }

  @Patch('profile')
  @Roles('client', 'freelancer')
  updateProfile(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateProfile(req.user.userId, updateUserDto);
  }

  @Post('profile/avatar')
  @Roles('client', 'freelancer')
  @UseInterceptors(FileInterceptor('file'))
  uploadAvatar(@Request() req, @UploadedFile() file: Express.Multer.File) {
    return this.userService.uploadAvatar(req.user.userId, file);
  }
}
