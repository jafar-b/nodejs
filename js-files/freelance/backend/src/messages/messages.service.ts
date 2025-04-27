import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMessageDto } from 'src/dtos/message.dto';
import { Message } from 'src/entities/message.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  async create(createMessageDto: CreateMessageDto, senderId: string): Promise<Message> {
    const newMessage = this.messageRepository.create({
      projectId: +createMessageDto.projectId, 
      senderId: +senderId,
      recipientId: +createMessageDto.receiverId,
      content: createMessageDto.content,
      isRead: false,
    });
    return await this.messageRepository.save(newMessage);
  }

  async findAll(): Promise<Message[]> {
    return await this.messageRepository.find();
  }

  async findAllForUser(userId: string): Promise<Message[]> {
    return await this.messageRepository.find({
      where: [
        { senderId: +userId },
        { recipientId: +userId },
      ],
    });
  }

  async findConversation(user1Id: string, user2Id: string): Promise<Message[]> {
    return await this.messageRepository.find({
      where: [
        { senderId: +user1Id, recipientId: +user2Id },
        { senderId: +user2Id, recipientId: +user1Id },
      ],
      order: { createdAt: 'ASC' },
    });
  }

  async findProjectMessages(projectId: string): Promise<Message[]> {
    return await this.messageRepository.find({
      where: { projectId: +projectId },
      order: { createdAt: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Message> {
    const message = await this.messageRepository.findOne({ where: { id: +id } });
    if (!message) {
      throw new NotFoundException(`Message with ID ${id} not found`);
    }
    return message;
  }

  async markAsRead(id: string, userId: string): Promise<Message> {
    const message = await this.findOne(id);

    if (message.recipientId !== +userId) {
      throw new ForbiddenException('You do not have permission to mark this message as read');
    }

    message.isRead = true;
    return await this.messageRepository.save(message);
  }

  async remove(id: string, userId: string): Promise<{ success: true }> {
    const message = await this.findOne(id);

    if (message.senderId !== +userId && message.recipientId !== +userId) {
      throw new ForbiddenException('You do not have permission to delete this message');
    }

    await this.messageRepository.remove(message);
    return { success: true };
  }
}