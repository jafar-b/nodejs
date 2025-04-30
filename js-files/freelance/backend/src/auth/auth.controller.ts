import { Body, Controller, Post, UseGuards, Request,} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  async login(@Body() loginDto: { email: string; password: string }) {
    return this.authService.login(loginDto.email, loginDto.password);
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