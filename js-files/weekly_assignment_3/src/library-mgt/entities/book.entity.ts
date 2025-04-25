import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { BorrowRecord } from "./borrowRecord.entity";
import { Author } from "./author.entity";
import { IsIn } from "class-validator";

@Entity()
export class Book{

    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    name:string;
    
    @Column()
    isbn:number;
    
    @Column()
    quantity:number;  

    @OneToMany(()=>BorrowRecord,(borrowRecord)=>borrowRecord.book) 
    borrowRecords:BorrowRecord[];
    
    @Column()
    available:number;

    @ManyToOne(()=>Author,(author)=>author.book)
    @JoinColumn({ name: 'author_id' }) // Explicitly set the foreign key column name
    author_id: number; // Use the related entity type here
    @Column()
    price:number;
}