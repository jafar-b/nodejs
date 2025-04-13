import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class JsonParsePipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    
try{
  return JSON.parse(value);
}catch(err){
  return {"Error While Parsing to JSON":err};
}

  }
}
