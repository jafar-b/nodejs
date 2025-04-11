import { ForbiddenException, Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class VerifyApiKeyMiddlewareMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    const apiKey = req.headers['x-api-key'];
    console.log(`Request IP: ${req.ip}`);

    if (!apiKey || apiKey!==process.env.API_KEY) {
      console.log("Api key is ",apiKey);
      
      throw new ForbiddenException('Incorrect or missing API key');
    }
    
    next();
  }
}
