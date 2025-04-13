import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserService } from './user/user.service';
import { RateLimitMiddleware } from './rate-limit/rate-limit.middleware';
import { CartModule } from './cart/cart.module';
import { PaymentService } from './payment/payment.service';
import { OrdersModule } from './orders/orders.module';
import { OrdersService } from './orders/orders.service';
import { PaymentModule } from './payment/payment.module';
import { UsersController } from './user/user.controller';
import { EmploymentModule } from './employment/employment.module';

@Module({
  imports: [CartModule, OrdersModule,PaymentModule, EmploymentModule],
  controllers: [AppController,UsersController],
  providers: [AppService, UserService,OrdersService],
})
export class AppModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer.apply(RateLimitMiddleware).forRoutes('*');
  // }

}
