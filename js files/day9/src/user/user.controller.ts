import { Body, Controller, Get, Post, UsePipes } from '@nestjs/common';
import { UserDto } from './user-dto/user-dto';
import { TransformUserPipe } from 'src/transform-user-input/transform-user-input.pipe';
import { UserAgent } from 'src/decorator/userAgentDecorator';

@Controller('user')
export class UserController {


    @Post("/validations")
    @UsePipes(TransformUserPipe)
    transformUser(@Body() userdto:UserDto,@UserAgent() useragent:string){
        return {userdto,useragent};
    }


    
    @Post()
    transform(@Body() userdto:UserDto){
        return userdto;
    }


}
