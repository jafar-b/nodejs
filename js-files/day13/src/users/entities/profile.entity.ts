import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { User } from "./user.entity";


@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string;

  @OneToMany(() => User, (user) => user.profile)    //multiple users can have same types eg.engineer,doctor,etc
  users: User[];
}
