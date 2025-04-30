import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Project } from './project.entity';

export enum ContractStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  TERMINATED = 'TERMINATED',
}

@Entity('contracts')
export class Contract {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'project_id', unique: true })
  projectId: number;

  @Column({ name: 'client_id' })
  clientId: number;

  @Column({ name: 'freelancer_id' })
  freelancerId: number;

  @Column({ type: 'text' })
  terms: string;

  @Column({
    type: 'enum',
    enum: ContractStatus,
    default: ContractStatus.DRAFT,
  })
  status: ContractStatus;

  @Column({ name: 'start_date' })
  startDate: Date;

  @Column({ name: 'end_date', nullable: true })
  endDate: Date;

  @Column({ name: 'signed_client_at', nullable: true })
  signedClientAt: Date;

  @Column({ name: 'signed_freelancer_at', nullable: true })
  signedFreelancerAt: Date;

  @ManyToOne(() => Project)
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @ManyToOne(() => User, user => user.clientContracts)
  @JoinColumn({ name: 'client_id' })
  client: User;

  @ManyToOne(() => User, user => user.freelancerContracts)
  @JoinColumn({ name: 'freelancer_id' })
  freelancer: User;
}