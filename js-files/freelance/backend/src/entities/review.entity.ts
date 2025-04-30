import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { User } from './user.entity';
import { Project } from './project.entity';

@Entity('reviews')
@Unique(['projectId', 'reviewerId', 'revieweeId'])
export class Review {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'project_id' })
  projectId: number;

  @Column({ name: 'reviewer_id' })
  reviewerId: number;

  @Column({ name: 'reviewee_id' })
  revieweeId: number;

  @Column()
  rating: number;

  @Column({ type: 'text', nullable: true })
  comment: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Relationships
  @ManyToOne(() => Project, project => project.reviews)
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @ManyToOne(() => User, user => user.givenReviews)
  @JoinColumn({ name: 'reviewer_id' })
  reviewer: User;

  @ManyToOne(() => User, user => user.receivedReviews)
  @JoinColumn({ name: 'reviewee_id' })
  reviewee: User;
}