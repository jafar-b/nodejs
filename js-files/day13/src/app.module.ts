import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from './users/entities/profile.entity';
import { User } from './users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'day13', 
      entities: [User, Profile],
      synchronize: true, // auto-create tables (turn off in production)
    }),
    TypeOrmModule.forFeature([User, Profile]),
    JwtModule.register({ secret: 'supersecret' })
  ,
    UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
