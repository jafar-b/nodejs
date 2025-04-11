import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './product/product.module';
import { JsonParsePipe } from './json-parse/json-parse.pipe';
import { RequestLoggerMiddleware } from './request-logger/request-logger.middleware';
import { AuthMiddleware } from './auth/auth.middleware';
import { VerifyApiKeyMiddlewareMiddleware } from './verify-api-key-middleware/verify-api-key-middleware.middleware';
import * as dotenv from 'dotenv';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';

@Module({
  imports: [ProductModule,ConfigModule.forRoot({ isGlobal: true }), UserModule],
  controllers: [AppController],
  providers: [AppService,JsonParsePipe
],
})
export class AppModule {
// configure(consumer: MiddlewareConsumer) {
//   consumer
//     .apply()
//     .forRoutes({ path: '*', method: RequestMethod.ALL });
// }



}
