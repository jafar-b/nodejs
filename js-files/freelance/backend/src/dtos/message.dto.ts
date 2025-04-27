import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  projectId: string;

  @IsString()
  senderId: string;

  @IsString()
  receiverId: string;

  @IsString()
  content: string;

  @IsBoolean()
  @IsOptional()
  isRead?: boolean;
}