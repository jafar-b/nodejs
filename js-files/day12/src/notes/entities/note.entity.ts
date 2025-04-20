import { Column, Entity, Generated, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Note {

@PrimaryGeneratedColumn()
id:number;

@Column()
title:string;

@Column()
body:string


}