import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { log } from 'console';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
const request=context.switchToHttp().getRequest()
const url=request.url
const method=request.method
const time=new Date().toISOString()

log("Response Received!");

    return next.handle().pipe(tap(()=>log(`[${time}] ${method} ${url} - Response sent`)));
  }
}
