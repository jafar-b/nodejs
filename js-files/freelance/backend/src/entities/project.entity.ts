import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Bid } from './bid.entity';
import { Milestone } from './milestone.entity';
import { Invoice } from './invoice.entity';
import { Message } from './message.entity';
import { File } from './file.entity';
import { Contract } from './contract.entity';
import { Review } from './review.entity';
import { Dispute } from './dispute.entity';

import { ProjectStatus, PaymentType, ProjectVisibility } from 'src/enums/allEnums';
import { ProjectCategory } from './project-category.entity';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'client_id' })
  clientId: number;

  @Column({ name: 'assigned_freelancer_id', nullable: true })
  assignedFreelancerId: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({
    type: 'enum',
    enum: ProjectStatus,
    default: ProjectStatus.DRAFT,
  })
  status: ProjectStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  budget: number;

  @Column({ nullable: true })
  deadline: Date;

  @Column({
    name: 'payment_type',
    type: 'enum',
    enum: PaymentType,
    default: PaymentType.FIXED,
  })
  paymentType: PaymentType;

  @Column({ name: 'category_id' })
  categoryId: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({
    type: 'enum',
    enum: ProjectVisibility,
    default: ProjectVisibility.PUBLIC,
  })
  visibility: ProjectVisibility;

  @Column({ name: 'attachment_urls', type: 'text', array: true, nullable: true })
  attachments: string[];

  @Column({ name: 'bids_count', type: 'int', default: 0 })
  bidsCount: number;

  @ManyToOne(() => User, user => user.clientProjects)
  @JoinColumn({ name: 'client_id' })
  client: User;

  @ManyToOne(() => User, user => user.freelancerProjects)
  @JoinColumn({ name: 'assigned_freelancer_id' })
  assignedFreelancer: User;

  @ManyToOne(() => ProjectCategory, category => category.projects)
  @JoinColumn({ name: 'category_id' })
  category: ProjectCategory;

  @OneToMany(() => Bid, bid => bid.project)
  bids: Bid[];

  @OneToMany(() => Milestone, milestone => milestone.project)
  milestones: Milestone[];

  @OneToMany(() => Invoice, invoice => invoice.project)
  invoices: Invoice[];

  @OneToMany(() => Message, message => message.project)
  messages: Message[];

  @OneToMany(() => File, file => file.project)
  files: File[];

  @OneToMany(() => Contract, contract => contract.project)
  contracts: Contract[];

  @OneToMany(() => Review, review => review.project)
  reviews: Review[];

  @OneToMany(() => Dispute, dispute => dispute.project)
  disputes: Dispute[];
}