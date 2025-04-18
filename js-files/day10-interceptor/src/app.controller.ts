import { Body, Controller, Get, Post, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { LoggingInterceptor } from './logging/logging.interceptor';
import { StringToNumericInterceptor } from './string-to-numeric/string-to-numeric.interceptor';

@Controller()
@UseInterceptors(LoggingInterceptor)
export class AppController {
  constructor(private readonly appService: AppService) {}
  
  @Get()
  @UseInterceptors(LoggingInterceptor)
  getHello(): string {
    return this.appService.getHello();
  }

  @Post("string-to-numeric")
  @UseInterceptors(StringToNumericInterceptor)
  convert(@Body() body: { numeric_values: string }){
    console.log(body.numeric_values); 
    return { numeric_values: body.numeric_values };
  }


}
