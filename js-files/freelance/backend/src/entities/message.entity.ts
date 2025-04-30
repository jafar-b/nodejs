import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Project } from './project.entity';
import { File } from './file.entity';
import { MessageAttachment } from './message-attachment.entity';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ name: 'project_id' })
  projectId: number;

  @Column({ name: 'sender_id' })
  senderId: number;

  @Column({ type: 'text' })
  content: string;

  @Column({ name: 'is_read', default: false })
  isRead: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Relationships
  @ManyToOne(() => Project, project => project.messages)
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @ManyToOne(() => User, user => user.sentMessages)
  @JoinColumn({ name: 'sender_id' })
  sender: User;

  @OneToMany(() => File, file => file.message)
  files: File[];

  @OneToMany(() => MessageAttachment, attachment => attachment.message)
  attachments: MessageAttachment[];
}