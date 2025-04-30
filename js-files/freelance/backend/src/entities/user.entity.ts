import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, OneToMany, JoinColumn } from "typeorm";
import { Dispute } from "./dispute.entity";
import { UserRole } from "src/enums/allEnums";
import { Bid } from "./bid.entity";
import { Contract } from "./contract.entity";
import { Message } from "./message.entity";
import { Payment } from "./payment.entity";
import { Profile } from "./profile.entity";
import { Project } from "./project.entity";
import { Review } from "./review.entity";
import { UserSkill } from "./userSkill.entity";
import { File } from "./file.entity";
import { Subscription } from "./subscription.entity";
import { Notification } from "./notification.entity";
import { ClientInfo } from "./client-info.entity";

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'password_hash' })
  passwordHash: string;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column({
    type: 'enum',
    enum: UserRole,
  })
  role: UserRole;

  @Column({ name: 'phone_number', default:null })
  phoneNumber: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'is_verified', default: false })
  isVerified: boolean;

  @Column({ name: 'verification_token', default: null })
  verificationToken: string;
  
  @Column({ name: 'refresh_token', type: 'text', nullable: true })
  refreshToken: string | null;

  @Column({ name: 'last_login', default:null })
  lastLogin: Date;

  // Relationships
  @OneToOne(() => ClientInfo, clientInfo => clientInfo.user)
  clientInfo: ClientInfo;

  @OneToOne(() => Profile, profile => profile.user)
  profile: Profile;

  @OneToMany(() => UserSkill, userSkill => userSkill.user)
  skills: UserSkill[];

  @OneToMany(() => Project, project => project.client)
  clientProjects: Project[];

  @OneToMany(() => Project, project => project.assignedFreelancer)
  freelancerProjects: Project[];

  @OneToMany(() => Bid, bid => bid.freelancer)
  bids: Bid[];

  @OneToMany(() => Message, message => message.sender)
  sentMessages: Message[];

  @OneToMany(() => File, file => file.user)
  files: File[];

  @OneToMany(() => Payment, payment => payment.sender)
  sentPayments: Payment[];

  @OneToMany(() => Payment, payment => payment.recipient)
  receivedPayments: Payment[];

  @OneToMany(() => Contract, contract => contract.client)
  clientContracts: Contract[];

  @OneToMany(() => Contract, contract => contract.freelancer)
  freelancerContracts: Contract[];

  @OneToMany(() => Review, review => review.reviewer)
  givenReviews: Review[];

  @OneToMany(() => Review, review => review.reviewee)
  receivedReviews: Review[];

  @OneToMany(() => Notification, notification => notification.user)
  notifications: Notification[];

  @OneToMany(() => Subscription, subscription => subscription.user)
  subscriptions: Subscription[];

  @OneToMany(() => Dispute, dispute => dispute.reportedBy)
  reportedDisputes: Dispute[];

  @OneToMany(() => Dispute, dispute => dispute.reportedAgainst)
  disputesAgainst: Dispute[];
}
