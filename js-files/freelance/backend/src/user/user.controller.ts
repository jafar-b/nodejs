import { Controller, Get, Patch, Request, UseInterceptors, UploadedFile, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from '../auth/decorators/roles.decorator';
import { UpdateUserDto } from '../dtos/user.dto';
import { diskStorage } from 'multer';
import { extname } from 'path';

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
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          const ext = extname(file.originalname);
          const filename = `${uniqueSuffix}${ext}`;
          console.log('Generated filename in controller:', filename);
          callback(null, filename);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/^image\//)) {
          return callback(new Error('Only image files are allowed!'), false);
        }
        callback(null, true);
      },
    }),
  )
  uploadAvatar(
    @Request() req, 
    @UploadedFile() file: Express.Multer.File
  ) {
    console.log('Controller received file:', file); // Debug log
    if (!file) {
      throw new Error('No file received');
    }
    return this.userService.uploadAvatar(req.user.userId, file);
  }
}
