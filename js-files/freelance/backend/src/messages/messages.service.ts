import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMessageDto } from 'src/dtos/message.dto';
import { Message } from 'src/entities/message.entity';
import { UploadsService } from '../uploads/uploads.service';
import { Project } from '../entities/project.entity';
import { MessageAttachment } from '../entities/message-attachment.entity';
import { File } from '../entities/file.entity';
import { FileCategory } from '../entities/file.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(MessageAttachment)
    private readonly messageAttachmentRepository: Repository<MessageAttachment>,
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,
    private readonly uploadsService: UploadsService,
  ) {}

  async create(createMessageDto: CreateMessageDto, senderId: string): Promise<Message> {
    const newMessage = this.messageRepository.create({
      projectId: +createMessageDto.projectId, 
      senderId: +senderId,
      content: createMessageDto.content,
      isRead: false,
    });
    return await this.messageRepository.save(newMessage);
  }

  async findAll(): Promise<Message[]> {
    return await this.messageRepository.find({
      relations: ['sender', 'attachments', 'attachments.file'],
    });
  }

  async findAllForUser(userId: string): Promise<Message[]> {
    return await this.messageRepository.find({
      where: [
        { senderId: +userId },
      ],
      relations: ['sender', 'attachments', 'attachments.file'],
      order: { createdAt: 'DESC' },
    });
  }

  async findConversation(user1Id: string, user2Id: string): Promise<Message[]> {
    return await this.messageRepository.find({
      where: [
        { senderId: +user1Id },
        { senderId: +user2Id },
      ],
      relations: ['sender', 'attachments', 'attachments.file'],
      order: { createdAt: 'ASC' },
    });
  }

  async findProjectMessages(projectId: string): Promise<Message[]> {
    return await this.messageRepository.find({
      where: { projectId: +projectId },
      relations: ['sender', 'attachments', 'attachments.file'],
      order: { createdAt: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Message> {
    const message = await this.messageRepository.findOne({ 
      where: { id: +id },
      relations: ['sender', 'attachments', 'attachments.file'],
    });
    if (!message) {
      throw new NotFoundException(`Message with ID ${id} not found`);
    }
    return message;
  }

  async markAsRead(id: string, userId: string): Promise<Message> {
    const message = await this.findOne(id);
    message.isRead = true;
    return await this.messageRepository.save(message);
  }

  async remove(id: string, userId: string): Promise<{ success: true }> {
    const message = await this.findOne(id);
    
    if (message.senderId !== +userId) {
      throw new ForbiddenException('You do not have permission to delete this message');
    }

    // Delete associated attachments and files
    if (message.attachments && message.attachments.length > 0) {
      for (const attachment of message.attachments) {
        await this.messageAttachmentRepository.remove(attachment);
        if (attachment.file) {
          await this.fileRepository.remove(attachment.file);
        }
      }
    }

    await this.messageRepository.remove(message);
    return { success: true };
  }

  async getMessages(projectId: number, userId: number) {
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
      relations: ['client', 'assignedFreelancer'],
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }

    // Check if user is part of the project
    if (project.clientId !== userId && project.assignedFreelancerId !== userId) {
      console.warn(`Forbidden: user ${userId} tried to access messages for project ${projectId}. Project client: ${project.clientId}, freelancer: ${project.assignedFreelancerId}`);
      throw new ForbiddenException('You are not authorized to view these messages');
    }

    return this.messageRepository.find({
      where: { projectId },
      relations: ['sender', 'attachments', 'attachments.file'],
      order: { createdAt: 'ASC' },
    });
  }

  async sendMessage(
    projectId: number,
    userId: number,
    createMessageDto: CreateMessageDto,
    files: Array<Express.Multer.File>,
  ) {
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
      relations: ['client', 'assignedFreelancer'],
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }

    // Check if user is part of the project
    if (project.clientId !== userId && project.assignedFreelancerId !== userId) {
      console.warn(`Forbidden: user ${userId} tried to send a message to project ${projectId}. Project client: ${project.clientId}, freelancer: ${project.assignedFreelancerId}`);
      throw new ForbiddenException('You are not authorized to send messages in this project');
    }

    // Create the message first
    const message = this.messageRepository.create({
      ...createMessageDto,
      projectId,
      senderId: userId,
    });

    const savedMessage = await this.messageRepository.save(message);

    // Handle file attachments if any
    if (files && files.length > 0) {
      for (const file of files) {
        // Create File entity
        const fileEntity = this.fileRepository.create({
          fileName: file.originalname,
          filePath: this.uploadsService.getFileUrl(file.filename),
          fileType: file.mimetype,
          fileSize: file.size,
          userId,
          category: FileCategory.MESSAGE_ATTACHMENT,
        });
        const savedFile = await this.fileRepository.save(fileEntity);

        // Create MessageAttachment entity
        const attachment = this.messageAttachmentRepository.create({
          messageId: savedMessage.id,
          fileId: savedFile.id,
        });
        await this.messageAttachmentRepository.save(attachment);
      }
    }

    // Return the message with its attachments
    return this.messageRepository.findOne({
      where: { id: savedMessage.id },
      relations: ['sender', 'attachments', 'attachments.file'],
    });
  }
}