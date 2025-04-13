import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { UserService } from './user/user.service';
import { TimeoutDelay } from './decorators/timeoutdelay/timeoutdelay.decorator';
import { IsEvenPipe } from './is-even/is-even.pipe';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService,private readonly userSerVice:UserService) {}


  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get("/users/:id/role/:role")
  getUser(@Param('id')id:number,@Param('role')role:string){
return this.userSerVice.showUserDetails(Number(id),role)
  }


  @Get("/timeout")
  @TimeoutDelay(500)
  async getData() {
    await new Promise((res) => setTimeout(res, 5000)); 
    return { message: 'done' };
  }

  @Get("/check-even/:num")
  checkEven(@Param('num',IsEvenPipe) n:number){
    return n;
  }


  
}

