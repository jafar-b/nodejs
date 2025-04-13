import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class PaymentService {
  private payments = [
    {
      id: 1,
      userId: 1,
      cartId: 1,
      amount: 1200,
      method: 'upi',
      status: 'success',
      timestamp: '2025-04-12T09:15:00Z',
    },
    {
      id: 2,
      userId: 2,
      cartId: 2,
      amount: 1999,
      method: 'credit_card',
      status: 'failed',
      timestamp: '2025-04-12T10:00:00Z',
    },
    {
      id: 3,
      userId: 3,
      cartId: 3,
      amount: 299,
      method: 'cash_on_delivery',
      status: 'pending',
      timestamp: '2025-04-12T10:45:00Z',
    },
  ];



  getAllPayments() {
    return this.payments;
  }


  makePayment(id: number) {
    const samplePaymentRecord = {
        cartId:Number(id),
      id:this.payments.length,
      userId: 3,
      amount: 299,
      method: 'upi',
      status: 'success',
      timestamp: new Date().toString(),
    };
     this.payments.push(samplePaymentRecord);
return {success:this.payments}
  }

  create(paymentDto: CreatePaymentDto) {
    this.payments.push(paymentDto)
    return {success:paymentDto}
  }

  findOne(id: number) {
    return this.payments.filter((item) => item.id == id);
  }

  remove(id: number) {
    return this.payments.filter((item) => item.id !== id);
  }
}
