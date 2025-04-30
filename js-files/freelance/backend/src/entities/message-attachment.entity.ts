import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { Message } from './message.entity';
import { File } from './file.entity';

@Entity('message_attachments')
export class MessageAttachment {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @ManyToOne(() => Message, message => message.attachments)
  @JoinColumn({ name: 'message_id' })
  message: Message;

  @Column({ name: 'message_id' })
  messageId: number;

  @ManyToOne(() => File, file => file.messageAttachments)
  @JoinColumn({ name: 'file_id' })
  file: File;

  @Column({ name: 'file_id' })
  fileId: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
} 