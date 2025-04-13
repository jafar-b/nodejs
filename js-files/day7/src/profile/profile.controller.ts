import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ProfileService } from './profile.service';

@Controller('profile')
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @Post('create-profile/:userId')
  create(@Param('userId') userId: number, @Body('bio') bio: string) {
    return this.profileService.createProfile(bio);
  }

  @Get('get-profile/:userId')
  get(@Param('userId') userId: number) {
    return this.profileService.getProfileForUser(userId);
  }

  @Put('update-profile/:userId')
  update(@Param('userId') userId: number, @Body('bio') bio: string) {
    return { message: `Updated profile for user ${userId} with bio: ${bio}` };
  }

  @Delete('delete-profile/:userId')
  delete(@Param('userId') userId: number) {
    return { message: `Deleted profile for user ${userId}` };
  }
}
