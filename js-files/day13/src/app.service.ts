import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AppService {
  constructor(private jwtService: JwtService) {}
  
    
  getHello(): string {
    return 'Hello World!';
  }



  async login(userId: number) {
    const accessToken = await this.jwtService.signAsync(
      { sub: userId },
      { expiresIn: '15m' },
    );

    const refreshToken = await this.jwtService.signAsync(
      { sub: userId },
      { expiresIn: '7d' },
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  async refresh(refreshToken: string) {
    const payload = this.jwtService.verify(refreshToken);
    return this.jwtService.sign({ sub: payload.sub }, { expiresIn: '15m' });
  }
}
