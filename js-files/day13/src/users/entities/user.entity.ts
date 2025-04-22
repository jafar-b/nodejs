import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { Profile } from "./profile.entity";


@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  age:number;

  @ManyToOne(() => Profile, (profile) => profile.users)   //many users can have one profile type
  profile: Profile;
}

