import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UserSkill } from './userSkill.entity';

@Entity('skills')
export class Skill {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  category: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  // Relationships
  @OneToMany(() => UserSkill, userSkill => userSkill.skill)
  userSkills: UserSkill[];
}
