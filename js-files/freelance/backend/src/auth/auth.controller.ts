import { Body, Controller, Post, UseGuards, Request, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('client/login')
  async clientLogin(@Body() loginDto: { email: string; password: string }) {
    const client = await this.authService.validateClient(
      loginDto.email,
      loginDto.password,
    );
    return this.authService.loginClient(client);
  }

  @Public()
  @Post('freelancer/login')
  async freelancerLogin(@Body() loginDto: { email: string; password: string }) {
    const freelancer = await this.authService.validateFreelancer(
      loginDto.email,
      loginDto.password,
    );
    return this.authService.loginFreelancer(freelancer);
  }

  @Public()
  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  async refreshTokens(@Request() req) {
    const { userId, role, refreshToken } = req.user;
    return this.authService.refreshTokens(userId, role, refreshToken);
  }

  @Post('logout')
  async logout(@Request() req) {
    const { userId, role } = req.user;
    return this.authService.removeRefreshToken(userId, role);
  }
} 