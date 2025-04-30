import { Entity, Unique, PrimaryGeneratedColumn, Column, Check, ManyToOne, JoinColumn } from "typeorm";
import { Skill } from "./skill.entity";
import { User } from "./user.entity";
import { ProficiencyLevel } from "../enums/allEnums";

@Entity('user_skills')
@Unique(['user_id', 'skill_id'])
export class UserSkill {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  user_id: number;

  @Column()
  skill_id: number;

  @Column({
    type: 'enum',
    enum: ProficiencyLevel,
    default: ProficiencyLevel.BEGINNER
  })
  proficiency_level: ProficiencyLevel;

  @Column({ nullable: true })
  years_experience: number;

  // Relationships
  @ManyToOne(() => User, user => user.skills)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Skill)
  @JoinColumn({ name: 'skill_id' })
  skill: Skill;
}
