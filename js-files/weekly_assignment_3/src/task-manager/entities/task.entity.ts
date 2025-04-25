import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from "typeorm";
import { User } from "./user.entity";

  @Entity()
  export class Task {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    title: string;
  
    @Column({ type: 'text' })
    description: string; 
  
    @Column({ default: 'TODO' })
    status: string ; 
    
    @Column()
    createdBy: number; 
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  
    @DeleteDateColumn()
    deletedAt?: Date;
  
    @Column({ type: 'datetime', nullable: true })
    dueDate?: Date; 
    @Column({ nullable: true })
    priority?:string; 
  }
