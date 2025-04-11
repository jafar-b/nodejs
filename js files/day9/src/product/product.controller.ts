import { Body, Controller, Get, Param, ParseBoolPipe, ParseIntPipe, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto/create-product.dto';
import { TrimPipe } from 'src/trim/trim.pipe';
import { ToUpperCasePipe } from 'src/to-upper-case/to-upper-case.pipe';
import { JsonParsePipe } from 'src/json-parse/json-parse.pipe';
import { UserAgent } from 'src/decorator/userAgentDecorator';

@Controller('product')
// @UsePipes(new ValidationPipe())
export class ProductController {

    @Post()
    postProduct(@Body() dto:CreateProductDto){ 
        return {message :dto};
    }
    @Get("/status")
    getStatus(@Query('isActive',ParseBoolPipe) isActive: boolean):boolean {
      console.log('Received:', isActive);
      return isActive;
    }
    @Post("/trim")
    postName(@Body('name',new TrimPipe()) name:string) {
      console.log('Received:', name);
      return {name};
    }

    @Post("/toUpperCase")
    convertToUpperCase(@Body('name',new ToUpperCasePipe()) name:string) {
      console.log('Received:', name);
      return {name};
    }
  
    @Post("/user")
    PostUser(@Body('name',new TrimPipe()) name:string) {
      console.log('Received:', name);
      return {name};
    }

    @Get("/parse")
    parseToJSON(@Query('name',new JsonParsePipe()) name:string) {
      console.log('Received:', name);
      return name;
    }
    
    @Get("/log")
logUserAgent(@UserAgent() userAgent: string) {
  console.log('User-Agent:', userAgent);
  return { userAgent };
}

   
    @Get("/:id")
    getProduct(@Param('id',ParseIntPipe) id:number){
     return id;
    }

    @Post("/admin/toUpperCase")
    convertToUpperCaseAdmin(@Body('name',new ToUpperCasePipe()) name:string) {
      console.log('Received:', name);
      return {name};
    }


}

