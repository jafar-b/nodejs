import { Controller, Get, Post, Body, Param, Delete, Request, Patch, ForbiddenException, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from 'src/dtos/message.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  @Roles('client', 'freelancer')
  create(@Body() createMessageDto: CreateMessageDto, @Request() req) {
    return this.messagesService.create(createMessageDto, req.user.userId);
  }

  @Get()
  @Roles('client', 'freelancer')
  findAll(@Request() req) {
    return this.messagesService.findAllForUser(req.user.userId);
  }

  @Get('conversation/:userId')
  @Roles('client', 'freelancer')
  findConversation(@Param('userId') userId: string, @Request() req) {
    return this.messagesService.findConversation(req.user.userId, userId);
  }

  @Get('project/:projectId')
  @Roles('client', 'freelancer')
  findProjectMessages(@Param('projectId') projectId: string, @Request() req) {
    return this.messagesService.findProjectMessages(projectId);
  }

  // @Get(':id')
  // @Roles('client', 'freelancer')
  // findOne(@Param('id') id: string, @Request() req) {
  //   const message = this.messagesService.findOne(id);
    
  //   // Check if user is sender or recipient
  //   if (message.senderId !== req.user.userId && message.recipientId !== req.user.userId) {
  //     throw new ForbiddenException('You do not have permission to view this message');
  //   }
    
  //   return message;
  // }

  @Patch(':id/read')
  @Roles('client', 'freelancer')
  markAsRead(@Param('id') id: string, @Request() req) {
    return this.messagesService.markAsRead(id, req.user.userId);
  }

  @Delete(':id')
  @Roles('client', 'freelancer')
  remove(@Param('id') id: string, @Request() req) {
    return this.messagesService.remove(id, req.user.userId);
  }

  @Get(':projectId')
  @Roles('client', 'freelancer')
  getMessages(@Param('projectId') projectId: string, @Request() req) {
    return this.messagesService.getMessages(+projectId, req.user.userId);
  }

  @Post(':projectId')
  @Roles('client', 'freelancer')
  @UseInterceptors(FilesInterceptor('attachments'))
  sendMessage(
    @Param('projectId') projectId: string,
    @Body() createMessageDto: CreateMessageDto,
    @Request() req,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    return this.messagesService.sendMessage(
      +projectId,
      req.user.userId,
      createMessageDto,
      files,
    );
  }
} 