import { Injectable, NestMiddleware } from '@nestjs/common';
import { log } from 'console';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    if (!req.headers.authorization) {
      console.log("Auth Middl3ware");
      
      return res.status(403).send('Forbidden');
    }
  
    next();
  }
}
