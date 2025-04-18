import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { log } from 'console';
import { Observable } from 'rxjs';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const auth = req.headers['authorization'];
    if (!auth || !auth.startsWith('Bearer ')) throw new UnauthorizedException();

    const token = auth.split(' ')[1];
    try {
      req['user'] = await this.verify(token);
      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }

private verify(token: string): Promise<any> {
  return new Promise((res, rej) => {
    jwt.verify(token, 'your_secret_key', (err, decoded) => {
      if (err) return rej(err);
      res(decoded);
    });
  });
}
}






