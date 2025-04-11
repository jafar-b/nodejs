import { Body, Get, Injectable, Param, Post } from '@nestjs/common';

import { UserService } from 'src/user/user.service';

@Injectable()
export class ProfileService {
  constructor(private userService: UserService) {}

  
  @Post("create-profile/")
  createProfile(@Body('bio') bio:string) {
    return {id:1,bio};
  }
  
  @Get("get-profile/:userId")
  getProfileForUser(userId: number) {
    const user=this.userService.findUserById(userId)
    return { userId: 1, bio: 'Welcome to my bio !',user };
    
  }

}




// profile.module.ts
import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { UserModule } from '../user/user.module'; //  importing UserModule

@Module({
  imports: [UserModule], // important for using exported services
  providers: [ProfileService],
  controllers: [ProfileController],
})
export class ProfileModule {}