import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { UserService } from 'src/user/user.service';

@Module({
  providers: [ProfileService,UserService],
  controllers: [ProfileController]
})
export class ProfileModule {}
