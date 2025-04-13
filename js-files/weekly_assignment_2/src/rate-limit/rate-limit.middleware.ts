import { HttpException, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
  private requestsMap = new Map<string, { count: number; timestamp: number }>();
   private limit = 3;
   private duration = 60 * 1000; // 1 minute

  use(req: Request, res: Response, next: NextFunction) {
    const ip = req.ip || '';
    const currentTime = Date.now();

    const requestData = this.requestsMap.get(ip);

    if (!requestData || currentTime - requestData.timestamp > this.duration) {
      this.requestsMap.set(ip, { count: 1, timestamp: currentTime });
      return next();
    }

    if (requestData.count < this.limit) {
      requestData.count += 1;
      this.requestsMap.set(ip, requestData);
      return next();
    }
    throw new HttpException('Rate limit exceeded. Try again later.',429);
  }
}
