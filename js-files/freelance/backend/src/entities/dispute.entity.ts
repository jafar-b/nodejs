import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Project } from './project.entity';

export enum DisputeStatus {
  OPEN = 'OPEN',
  IN_REVIEW = 'IN_REVIEW',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
}

@Entity('disputes')
export class Dispute {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'project_id' })
  projectId: number;

  @Column({ name: 'reported_by' })
  reportedById: number;

  @Column({ name: 'reported_against' })
  reportedAgainstId: number;

  @Column()
  reason: string;

  @Column({ type: 'text' })
  description: string;

  @Column({
    type: 'enum',
    enum: DisputeStatus,
    default: DisputeStatus.OPEN,
  })
  status: DisputeStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'resolved_at', nullable: true })
  resolvedAt: Date;

  @ManyToOne(() => Project, project => project.disputes)
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @ManyToOne(() => User, user => user.reportedDisputes)
  @JoinColumn({ name: 'reported_by' })
  reportedBy: User;

  @ManyToOne(() => User, user => user.disputesAgainst)
  @JoinColumn({ name: 'reported_against' })
  reportedAgainst: User;
}