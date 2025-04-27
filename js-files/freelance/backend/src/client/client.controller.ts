import { Controller, Get, Post, Body, Patch, Param, Delete, Request } from '@nestjs/common';
import { ClientService } from './client.service';
import { UpdateClientDto } from './dto/update-client.dto';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateUserDto } from 'src/dtos/user.dto';

@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Public()
  @Post('register')
  create(@Body() userDto: CreateUserDto) {
    return this.clientService.create(userDto);
  }

  @Get('profile')
  @Roles('client')
  getProfile(@Request() req) {
    return this.clientService.findOne(req.user.userId);
  }

  @Get()
  @Roles('client')
  findAll() {
    return this.clientService.findAll();
  }

  @Get(':id')
  @Roles('client')
  findOne(@Param('id') id: string) {
    return this.clientService.findOne(id);
  }

  @Patch(':id')
  @Roles('client')
  update(@Param('id') id: string, @Body() updateClientDto: UpdateClientDto) {
    return this.clientService.update(id, updateClientDto);
  }

  @Delete(':id')
  @Roles('client')
  remove(@Param('id') id: string) {
    return this.clientService.remove(id);
  }
}
