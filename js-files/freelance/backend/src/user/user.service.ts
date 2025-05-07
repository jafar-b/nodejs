import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UpdateUserDto } from '../dtos/user.dto';
import { UploadsService } from '../uploads/uploads.service';
import * as bcrypt from 'bcrypt';
import { Profile } from '../entities/profile.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    private readonly uploadsService: UploadsService,
  ) {}

  async getProfile(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: +userId },
      relations: ['profile'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const { passwordHash, refreshToken, ...result } = user;
    return result;
  }

  async updateProfile(userId: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({
      where: { id: +userId },
      relations: ['profile'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Update user fields
    const userFields = ['firstName', 'lastName', 'phoneNumber'];
    const userUpdates = {};
    userFields.forEach(field => {
      if (updateUserDto[field] !== undefined) {
        userUpdates[field] = updateUserDto[field];
      }
    });
    Object.assign(user, userUpdates);

    // Update profile fields
    const profileFields = ['bio', 'title', 'location', 'website', 'hourlyRate'];
    const profileUpdates = {};
    profileFields.forEach(field => {
      if (updateUserDto[field] !== undefined) {
        profileUpdates[field] = updateUserDto[field];
      }
    });

    if (!user.profile) {
      // Create new profile
      const newProfile = this.profileRepository.create({
        userId: +userId,
        ...profileUpdates
      });
      user.profile = await this.profileRepository.save(newProfile);
    } else {
      // Update existing profile
      Object.assign(user.profile, profileUpdates);
      await this.profileRepository.save(user.profile);
    }

    // Save user
    const updatedUser = await this.userRepository.save(user);

    const { passwordHash, refreshToken, ...result } = updatedUser;
    return result;
  }

  async uploadAvatar(userId: string, file: Express.Multer.File) {
    console.log('Service received file:', file); // Debug log
    
    if (!file) {
      throw new Error('No file uploaded');
    }

    // Log the complete file object for debugging
    console.log('Complete file object:', JSON.stringify(file, null, 2));

    const user = await this.userRepository.findOne({
      where: { id: +userId },
      relations: ['profile'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Create profile if it doesn't exist
    if (!user.profile) {
      const newProfile = this.profileRepository.create({ userId: +userId });
      user.profile = await this.profileRepository.save(newProfile);
    }
    
    // Construct the profile image URL directly from the filename
    const fileUrl = `/uploads/${file.filename}`;
    console.log('Setting profile image to:', fileUrl);
    
    // Update and save profile
    user.profile.profileImage = fileUrl;
    await this.profileRepository.save(user.profile);
    
    return { profileImage: fileUrl };
  }
}
