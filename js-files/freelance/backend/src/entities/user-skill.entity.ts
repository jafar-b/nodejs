import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { User } from './user.entity';
import { Skill } from './skill.entity';
import { ProficiencyLevel } from '../enums/allEnums';

@Entity('user_skills')
@Unique(['userId', 'skillId'])
export class UserSkill {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @Column('uuid')
  skillId: string;

  @Column({
    type: 'enum',
    enum: ProficiencyLevel,
    default: ProficiencyLevel.BEGINNER
  })
  proficiencyLevel: ProficiencyLevel;

  @Column('int', { nullable: true })
  yearsExperience: number;

  @ManyToOne(() => User, user => user.skills)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Skill, skill => skill.userSkills)
  @JoinColumn({ name: 'skill_id' })
  skill: Skill;
} 