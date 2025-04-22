import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('login')
  login(@Body('userId') userId: number) {
    return this.appService.login(userId); // simple login with userId
  }

  @Post('refresh')
  refresh(@Body('refreshToken') refreshToken: string) {
    return this.appService.refresh(refreshToken);
  }
}
