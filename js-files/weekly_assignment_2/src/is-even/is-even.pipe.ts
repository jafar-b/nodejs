import { ArgumentMetadata, BadRequestException, HttpStatus, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class IsEvenPipe implements PipeTransform {
  transform(value:number, metadata: ArgumentMetadata) {

    if(isNaN(value)){throw new BadRequestException("Not a real number")}
    if(value %2 === 0){return "Even number"}else{
      throw new BadRequestException("Not an Even Number")
    }

    
  }
}
