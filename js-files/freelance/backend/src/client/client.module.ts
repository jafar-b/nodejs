import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { UserService } from 'src/user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]), // Register User entity
    UserModule, // Import UserModule if UserService is used
  ],
  controllers: [ClientController],
  providers: [ClientService],
  exports:[ClientService]
})
export class ClientModule {}
