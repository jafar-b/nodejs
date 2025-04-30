import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Project } from './project.entity';
import { Message } from './message.entity';
import { Milestone } from './milestone.entity';
import { User } from './user.entity';
import { MessageAttachment } from './message-attachment.entity';

export enum FileCategory {
  DELIVERABLE = 'DELIVERABLE',
  BRIEF = 'BRIEF',
  INVOICE = 'INVOICE',
  MESSAGE_ATTACHMENT = 'MESSAGE_ATTACHMENT',
}

@Entity('files')
export class File {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'project_id', nullable: true })
  projectId: number;

  @Column({ name: 'message_id', nullable: true })
  messageId: number;

  @Column({ name: 'milestone_id', nullable: true })
  milestoneId: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'file_name' })
  fileName: string;

  @Column({ name: 'file_path' })
  filePath: string;

  @Column({ name: 'file_type' })
  fileType: string;

  @Column({ name: 'file_size' })
  fileSize: number;

  @CreateDateColumn({ name: 'uploaded_at' })
  uploadedAt: Date;

  @Column({
    type: 'enum',
    enum: FileCategory,
    default: FileCategory.MESSAGE_ATTACHMENT
  })
  category: FileCategory;

  @ManyToOne(() => Project, project => project.files)
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @ManyToOne(() => Message, message => message.files)
  @JoinColumn({ name: 'message_id' })
  message: Message;

  @ManyToOne(() => Milestone, milestone => milestone.files)
  @JoinColumn({ name: 'milestone_id' })
  milestone: Milestone;

  @ManyToOne(() => User, user => user.files)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => MessageAttachment, attachment => attachment.file)
  messageAttachments: MessageAttachment[];

  @CreateDateColumn()
  createdAt: Date;
}