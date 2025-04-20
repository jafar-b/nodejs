
import { IsOptional, IsString, MinLength } from "class-validator";

export class CreateNoteDto {
    @IsOptional()
    id:number;


    @MinLength(1)
    @IsString()    
    title:string;


    @MinLength(1)
    @IsString()
    body:string;
}
