import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("greet/:name")
  getHello(@Param('name')name:string ): string {

    return `Hello ${name}`;

  }

  @Get("/tech-stack")
  getStack(){
    return this.appService.getTechStack()
  }

}



