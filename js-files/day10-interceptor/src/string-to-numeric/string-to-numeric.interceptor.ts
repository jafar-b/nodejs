import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class StringToNumericInterceptor implements NestInterceptor {
   intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
     return next.handle().pipe(map(data => {
             data.numeric_values = JSON.parse(data.numeric_values);
             return data
           }
         )
       );
     }
}
