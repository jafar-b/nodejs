import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Project } from './project.entity';
import { Milestone } from './milestone.entity';

export enum InvoiceStatus {
  DRAFT = 'DRAFT',
  SENT = 'SENT',
  PAID = 'PAID',
  CANCELLED = 'CANCELLED',
  OVERDUE = 'OVERDUE',
}

@Entity('invoices')
export class Invoice {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'project_id' })
  projectId: number;

  @Column({ name: 'milestone_id', nullable: true })
  milestoneId: number;

  @Column({ name: 'invoice_number', unique: true })
  invoiceNumber: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ name: 'tax_amount', type: 'decimal', precision: 10, scale: 2, default: 0 })
  taxAmount: number;

  @Column({ name: 'total_amount', type: 'decimal', precision: 10, scale: 2 })
  totalAmount: number;

  @Column({
    type: 'enum',
    enum: InvoiceStatus,
    default: InvoiceStatus.DRAFT,
  })
  status: InvoiceStatus;

  @Column({ name: 'due_date' })
  dueDate: Date;

  @Column({ name: 'payment_date', nullable: true })
  paymentDate: Date;

  @Column({ name: 'payment_method', nullable: true })
  paymentMethod: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Project, project => project.invoices)
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @ManyToOne(() => Milestone, milestone => milestone.invoices)
  @JoinColumn({ name: 'milestone_id' })
  milestone: Milestone;

  @Column({ name: 'freelancer_id', nullable: true })
  freelancerId: number;

  @Column({ name: 'client_id', nullable: true })
  clientId: number;
  @Column({ name: 'attachments', type: 'simple-array', nullable: true })
  attachments:string[];
}