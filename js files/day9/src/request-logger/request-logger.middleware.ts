import { Injectable, NestMiddleware } from '@nestjs/common';
import { log } from 'console';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    console.log({"request-type ":req.method,"URL/Path ":req.url,"DateTime":new Date(),});
    
    next();
  }
}
