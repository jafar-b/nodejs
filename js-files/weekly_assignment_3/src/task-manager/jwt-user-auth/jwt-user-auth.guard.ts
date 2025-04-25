import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { log } from 'console';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid authorization header');
    }

    const token = authHeader.split(' ')[1];

    try {
      console.log('JWT Token:', token); 
      const payload = this.jwtService.verify(token, { secret: 'your_jwt_secret' }); 
      console.log('JWT Payload:', payload); 
      request.user = payload; 
      return true;
    } catch (error) {
      console.error('JWT Verification Error:', error.message); 
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}





// const payload = {
//   id: 43,  // Use the id provided
//   username: 'admin', // Use the username provided
//   iat: 1745605614, // Use the iat provided
//   exp: 1746210414, // Use the exp provided
// };

// const jwtService = new JwtService({ secret: "your_jwt_secret" });
// const token = jwtService.sign(payload);
// log(token)