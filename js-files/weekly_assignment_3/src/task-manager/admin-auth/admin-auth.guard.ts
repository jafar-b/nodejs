import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';

@Injectable()
export class AdminAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const users = [
      { id: 1, username: 'admin', password: 'admin123', role: 'ADMIN' },
      { id: 2, username: 'user', password: 'user123', role: 'USER' },
    ];

//  { "id": 2, "username": "user", "password": "user123", "role": "USER" } 
// { "id": 1, "username": "admin", "password": "admin123", "role": "ADMIN" },

    const request = context.switchToHttp().getRequest();
    const { username, password } = request.body; // Assuming credentials are sent in the request body

    const user = users.find(
      (u) => u.username === username && u.password === password,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.role !== 'ADMIN') {
      throw new ForbiddenException('Access denied. Admins only.');
    }

    return true; 
  }
}
