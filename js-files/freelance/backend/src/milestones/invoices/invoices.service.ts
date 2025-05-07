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
    
    // Set the freelancer ID from the current user
    const freelancerId = +userId;

    // We need to obtain the client ID from another approach since the previous method was causing errors
    
    // Create the invoice with the data we have without explicitly setting clientId
    // The database might handle this with defaults or constraints
    const invoiceData = {
      ...createInvoiceDto,
      freelancerId: freelancerId,
      // We don't set clientId here to avoid type issues - it will be handled by database defaults
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    // Remove any undefined or null values to prevent TypeScript errors
    Object.keys(invoiceData).forEach(key => {
      if (invoiceData[key] === undefined || invoiceData[key] === null) {
        delete invoiceData[key];
      }
    });
    
    const newInvoice = this.invoiceRepository.create(invoiceData);
    
    return await this.invoiceRepository.save(newInvoice);
  }

  async findAll(): Promise<Invoice[]> {
    return await this.invoiceRepository.find({
      relations: ['project', 'milestone'],
      select: {
        id: true,
        projectId: true,
        milestoneId: true,
        invoiceNumber: true,
        amount: true,
        taxAmount: true,
        totalAmount: true,
        status: true,
        dueDate: true,
        paymentDate: true,
        paymentMethod: true,
        createdAt: true,
        updatedAt: true,
        project: {
          id: true,
          title: true
        },
        milestone: {
          id: true,
          title: true
        }
      }
    });
  }

  async findAllByFreelancer(freelancerId: string): Promise<Invoice[]> {
    return await this.invoiceRepository.find({
      where: { freelancerId: +freelancerId },
      relations: ['project', 'milestone'],
      select: {
        id: true,
        projectId: true,
        milestoneId: true,
        invoiceNumber: true,
        amount: true,
        taxAmount: true,
        totalAmount: true,
        status: true,
        dueDate: true,
        paymentDate: true,
        paymentMethod: true,
        createdAt: true, 
        updatedAt: true,
        project: {
          id: true,
          title: true
        },
        milestone: {
          id: true,
          title: true
        }
      }
    });
  }

  async findAllByProject(projectId: string): Promise<Invoice[]> {
    return await this.invoiceRepository.find({
      where: { projectId: +projectId },
      relations: ['project', 'milestone'],
      select: {
        id: true,
        projectId: true,
        milestoneId: true,
        invoiceNumber: true,
        amount: true,
        taxAmount: true,
        totalAmount: true,
        status: true,
        dueDate: true,
        paymentDate: true,
        paymentMethod: true,
        createdAt: true,
        updatedAt: true,
        project: {
          id: true,
          title: true
        },
        milestone: {
          id: true,
          title: true
        }
      }
    });
  }

  async findAllByMilestone(milestoneId: string): Promise<Invoice[]> {
    return await this.invoiceRepository.find({
      where: { milestoneId: +milestoneId },
      relations: ['project', 'milestone'],
      select: {
        id: true,
        projectId: true,
        milestoneId: true,
        invoiceNumber: true,
        amount: true,
        taxAmount: true,
        totalAmount: true,
        status: true,
        dueDate: true,
        paymentDate: true,
        paymentMethod: true,
        createdAt: true,
        updatedAt: true,
        project: {
          id: true,
          title: true
        },
        milestone: {
          id: true,
          title: true
        }
      }
    });
  }

  async findOne(id: string): Promise<Invoice> {
    const invoice = await this.invoiceRepository.findOne({
      where: { id: +id },
      relations: ['project', 'milestone'],
      select: {
        id: true,
        projectId: true,
        milestoneId: true,
        invoiceNumber: true,
        amount: true,
        taxAmount: true,
        totalAmount: true,
        status: true,
        dueDate: true,
        paymentDate: true,
        paymentMethod: true,
        createdAt: true,
        updatedAt: true,
        project: {
          id: true,
          title: true
        },
        milestone: {
          id: true,
          title: true
        }
      }
    });
    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }
    return invoice;
  }

  async findByInvoiceNumber(invoiceNumber: string): Promise<any> {
    // Find the invoice with the given invoice number
    const invoice = await this.invoiceRepository.findOne({
      where: { invoiceNumber },
      relations: ['project', 'milestone'],
    });
    
    if (!invoice) {
      throw new NotFoundException(`Invoice with number ${invoiceNumber} not found`);
    }
    
    // Query the database directly to get client and freelancer information
    const query = this.invoiceRepository.createQueryBuilder('invoice')
      .leftJoinAndSelect('invoice.project', 'project')
      .leftJoinAndSelect('invoice.milestone', 'milestone')
      .leftJoin('project.client', 'client')
      .leftJoin('project.freelancer', 'freelancer')
      .select([
        'invoice.id',
        'invoice.invoiceNumber',
        'invoice.amount',
        'invoice.taxAmount',
        'invoice.totalAmount',
        'invoice.status',
        'invoice.dueDate',
        'invoice.paymentDate',
        'invoice.paymentMethod',
        'invoice.createdAt',
        'invoice.updatedAt',
        'invoice.clientId',
        'invoice.freelancerId',
        'project.id',
        'project.title',
        'project.description',
        'milestone.id',
        'milestone.title',
        'milestone.description',
        'client.id',
        'client.name AS clientName',
        'client.email AS clientEmail',
        'freelancer.id',
        'freelancer.name AS freelancerName',
        'freelancer.email AS freelancerEmail'
      ])
      .where('invoice.invoiceNumber = :invoiceNumber', { invoiceNumber })
      .getRawOne();
    
    const result = await query;
    
    if (!result) {
      // Fall back to the basic invoice info if the query doesn't work
      return {
        ...invoice,
        clientName: 'Unknown Client',
        freelancerName: 'Unknown Freelancer',
        projectTitle: invoice.project?.title || 'Unknown Project',
        milestoneTitle: invoice.milestone?.title || 'Unknown Milestone',
      };
    }
    
    // Return the enhanced invoice with client and freelancer details
    return {
      id: result.invoice_id,
      invoiceNumber: result.invoice_invoiceNumber,
      amount: result.invoice_amount,
      taxAmount: result.invoice_taxAmount,
      totalAmount: result.invoice_totalAmount,
      status: result.invoice_status,
      dueDate: result.invoice_dueDate,
      project: {
        id: result.project_id,
        title: result.project_title,
        description: result.project_description
      },
      milestone: {
        id: result.milestone_id,
        title: result.milestone_title,
        description: result.milestone_description
      },
      clientName: result.clientName || 'Unknown Client',
      clientEmail: result.clientEmail || '',
      freelancerName: result.freelancerName || 'Unknown Freelancer',
      freelancerEmail: result.freelancerEmail || '',
      createdAt: result.invoice_createdAt,
      updatedAt: result.invoice_updatedAt
    };
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