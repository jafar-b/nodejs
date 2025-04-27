import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice } from 'src/entities/invoice.entity';
import { CreateInvoiceDto, UpdateInvoiceDto } from 'src/dtos/invoice.dto';
import { InvoiceStatus } from 'src/enums/allEnums';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
  ) {}

  async create(createInvoiceDto: CreateInvoiceDto, userId: string): Promise<Invoice> {
    // generating a unique invoice number based on current timestamp if not provided
    if (!createInvoiceDto.invoiceNumber) {
      const year = new Date().getFullYear();
      const timestamp = Date.now();
      createInvoiceDto.invoiceNumber = `INV-${year}-${timestamp}`;
    } else {
      // checking if invoice number already exists
      const existingInvoice = await this.invoiceRepository.findOne({ 
        where: { invoiceNumber: createInvoiceDto.invoiceNumber }
      });
      
      if (existingInvoice) {
        // If exists, append timestamp to make it unique
        const timestamp = Date.now();
        createInvoiceDto.invoiceNumber = `${createInvoiceDto.invoiceNumber}-${timestamp}`;
      }
    }
    
    const newInvoice = this.invoiceRepository.create({
      ...createInvoiceDto,
      freelancerId: +userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    
    return await this.invoiceRepository.save(newInvoice);
  }

  async findAll(): Promise<Invoice[]> {
    return await this.invoiceRepository.find();
  }

  async findAllByFreelancer(freelancerId: string): Promise<Invoice[]> {
    return await this.invoiceRepository.find({ where: { freelancerId: +freelancerId } });
  }

  async findAllByProject(projectId: string): Promise<Invoice[]> {
    return await this.invoiceRepository.find({ where: { projectId: +projectId } });
  }

  async findAllByMilestone(milestoneId: string): Promise<Invoice[]> {
    return await this.invoiceRepository.find({ where: { milestoneId: +milestoneId } });
  }

  async findOne(id: string): Promise<Invoice> {
    const invoice = await this.invoiceRepository.findOne({ where: { id: +id } });
    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }
    return invoice;
  }

  async update(id: string, updateInvoiceDto: UpdateInvoiceDto, userId: string, role: string): Promise<Invoice> {
    const invoice = await this.findOne(id);

    if (role === 'freelancer' && invoice.freelancerId !== +userId) {
      throw new ForbiddenException('You do not have permission to update this invoice');
    }

    Object.assign(invoice, updateInvoiceDto, { updatedAt: new Date() });
    return await this.invoiceRepository.save(invoice);
  }

  async remove(id: string, userId: string, role: string): Promise<{ success: true }> {
    const invoice = await this.findOne(id);

    if (role === 'freelancer' && invoice.freelancerId !== +userId) {
      throw new ForbiddenException('You do not have permission to delete this invoice');
    }

    await this.invoiceRepository.remove(invoice);
    return { success: true };
  }

  async markAsPaid(id: string, clientId: string): Promise<Invoice> {
    const invoice = await this.findOne(id);

    if (invoice.clientId !== +clientId) {
      throw new ForbiddenException('You do not have permission to mark this invoice as paid');
    }

    invoice.status = InvoiceStatus.PAID;
    invoice.paymentDate = new Date();
    return await this.invoiceRepository.save(invoice);
  }
}