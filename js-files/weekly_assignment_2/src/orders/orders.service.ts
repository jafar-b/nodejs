import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { log } from 'console';
import { OrderAlreadyConfirmedException } from 'src/exceptions/OrderAlreadyConfirmed.exception';

@Injectable() 
export class OrdersService {
private orders=[
{
  id: 1,
  userId: 1,
  cartId: 1,
  totalAmount: 999.99,
  status: 'pending', 
  paymentId: 301,
  createdAt: '2025-04-12T10:30:00.000Z',
},
{
  id: 2,
  userId: 2,
  cartId: 2,
  totalAmount: 1499.5,
  status: 'Confirmed',
  paymentId: 302,
  createdAt: '2025-04-12T11:45:00.000Z',
},
{
  id: 3,
  userId: 3,
  cartId: 3,
  totalAmount: 249.75,
  status: 'Confirmed',
  paymentId: 303,
  createdAt: '2025-04-12T12:10:00.000Z',
}

]

create(createOrderDto: CreateOrderDto) {
  const newOrder = { ...createOrderDto };
  
  this.orders.push(newOrder);
  return newOrder;
}

findAll() {
  return this.orders;
}

findOne(id: number) {
  const order = this.orders.find((o) => o.id === id);
 console.log(order);
 
  return order;
}

remove(id: number) {
  const index = this.orders.findIndex((o) => o.id === id); 
  if (index === -1) throw new NotFoundException('Order not found');
  const removed = this.orders.splice(index, 1);
  return removed[0];
}

confirmOrder(id: number) {
  const order = this.orders.find((o) => o.id == id);
  console.log(order);
  if (!order) throw new NotFoundException('Order not found');
  if(order.status==="Confirmed")throw new OrderAlreadyConfirmedException(id)
  order.status = 'Confirmed';
  this.orders.push(order)
  log("Order Confirmed!!")
  return order;
}
}
