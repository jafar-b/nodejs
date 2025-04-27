import { Module } from '@nestjs/common';
import { InvoicesController } from './invoices.controller';
import { InvoicesService } from './invoices.service';
import { UploadsModule } from 'src/uploads/uploads.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invoice } from 'src/entities/invoice.entity';

@Module({
  imports: [UploadsModule,TypeOrmModule.forFeature([Invoice])], 
  controllers: [InvoicesController],
  providers: [InvoicesService],
  exports: [InvoicesService],
})
export class InvoicesModule {} 