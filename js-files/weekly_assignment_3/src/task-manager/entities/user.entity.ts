
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    OneToMany,
  } from 'typeorm';
import { Task } from './task.entity';
  
  @Entity()
  export class User {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ unique: true })
    username: string;
  
    @Column()
    password: string; 
   
    @Column({ type: 'enum', enum: ['USER', 'ADMIN'], default: 'USER' })
    role: 'USER' | 'ADMIN';
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  
    @DeleteDateColumn()
    deletedAt?: Date;
  
    @OneToMany(() => Task, (task) => task.createdBy)
    tasksCreated: Task[];
  }
