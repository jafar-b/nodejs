import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Project } from './project.entity';
import { File } from './file.entity';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'project_id' })
  projectId: number;

  @Column({ name: 'sender_id' })
  senderId: number;

  @Column({ name: 'recipient_id' })
  recipientId: number;

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

  @ManyToOne(() => User, user => user.receivedMessages)
  @JoinColumn({ name: 'recipient_id' })
  recipient: User;

  @OneToMany(() => File, file => file.message)
  files: File[];
}