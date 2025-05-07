import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { InvoicesService } from './invoices.service';

import { Roles } from '../../auth/decorators/roles.decorator';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UploadsService } from '../../uploads/uploads.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Invoice } from 'src/entities/invoice.entity';
import { Repository } from 'typeorm';
import { CreateInvoiceDto, UpdateInvoiceDto } from 'src/dtos/invoice.dto';
import { plainToInstance } from 'class-transformer';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { extname} from 'path';
import { existsSync, mkdirSync } from 'fs';

@Controller('invoices')
export class InvoicesController {
  constructor(
    private readonly invoicesService: InvoicesService,
    private readonly uploadsService: UploadsService,
    @InjectRepository(Invoice)private readonly invoiceRepo:Repository<Invoice>
  ) {}

  @Post()
  @Roles('freelancer')
  @UseInterceptors(FilesInterceptor('attachments', 10, {
    storage: diskStorage({
      destination: (req, file, cb) => {
        const uploadPath = './uploads';
        if (!existsSync(uploadPath)) {
          mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
      },
      filename: (req, file, cb) => {
        const randomName = uuidv4();
        const fileName = `${randomName}${extname(file.originalname)}`;
        cb(null, fileName);
      },
    }),
  }))
  async create( 
    @Body() body: any,
    @Request() req,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    console.log('Received files:', files ? files.length : 0);
    if (files && files.length > 0) {
      console.log('File details:', files.map(f => ({
        filename: f.filename,
        originalname: f.originalname,
        size: f.size,
        mimetype: f.mimetype
      })));
    }
    
    const createInvoiceDto = plainToInstance(CreateInvoiceDto, body);
    
    const attachments = files && files.length > 0 
      ? files.map(file => this.uploadsService.getFileUrl(file.filename)) 
      : [];
    
    createInvoiceDto.attachments = attachments;
    return this.invoicesService.create(createInvoiceDto, req.user.userId);
  }

  @Get()
  @Roles('client', 'freelancer')
  findAll(@Request() req) {
    if (req.user.role === 'freelancer') {
      return this.invoicesService.findAllByFreelancer(req.user.userId);
    }
    return this.invoicesService.findAll();
  }

  @Get('project/:projectId')
  @Roles('client', 'freelancer')
  findAllByProject(@Param('projectId') projectId: string) {
    return this.invoicesService.findAllByProject(projectId);
  }

  @Get('milestone/:milestoneId')
  @Roles('client', 'freelancer')
  findAllByMilestone(@Param('milestoneId') milestoneId: string) {
    return this.invoicesService.findAllByMilestone(milestoneId);
  }

  @Get(':id')
  @Roles('client', 'freelancer')
  findOne(@Param('id') id: string) {
    return this.invoicesService.findOne(id);
  }

  @Get('number/:invoiceNumber')
  @Roles('client', 'freelancer')
  findByInvoiceNumber(@Param('invoiceNumber') invoiceNumber: string) {
    return this.invoicesService.findByInvoiceNumber(invoiceNumber);
  }

  @Patch(':id')
  @Roles('client', 'freelancer')
  update(
    @Param('id') id: string, 
    @Body() updateInvoiceDto: UpdateInvoiceDto,
    @Request() req,
  ) {
    return this.invoicesService.update(
      id, 
      updateInvoiceDto, 
      req.user.userId,
      req.user.role,
    );
  }

  @Delete(':id')
  @Roles('freelancer')
  remove(@Param('id') id: string, @Request() req) {
    return this.invoicesService.remove(
      id, 
      req.user.userId,
      req.user.role,
    );
  }

  @Post(':id/pay')
  @Roles('client')
  markAsPaid(
    @Param('id') id: string,
    @Request() req,
  ) {
    return this.invoicesService.markAsPaid(
      id,
      req.user.userId,
    );
  }
}