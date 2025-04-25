import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Book } from "./book.entity";

@Entity()
export class Author{

@PrimaryGeneratedColumn()
author_id:number;

@Column()
name:string;

@Column()
age:number;

@OneToMany(()=>Book,(book)=>book.author_id)
book:Book;

}