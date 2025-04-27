import { Controller, Post, UseInterceptors, UploadedFile, Get, Param, Delete, Res, NotFoundException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadsService } from './uploads.service';
import { Response } from 'express';
import { createReadStream } from 'fs';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { File } from '../entities/file.entity';

@Controller('uploads')
export class UploadsController {
  constructor(
    private readonly uploadsService: UploadsService,
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const savedFile = await this.fileRepository.save({
      fileName: file.originalname.toString(),
      filePath: this.uploadsService.getFileUrl(file.filename),
      fileSize: file.size,
      fileType: file.mimetype,
    });

    return savedFile;
  }

  @Get(':filename')
  @Public()
  async getFile(@Param('filename') filename: string, @Res() res: Response) {
    try {
      const filePath = this.uploadsService.getFilePath(filename);
      const file = createReadStream(filePath);
      file.pipe(res);
    } catch (error) {
      throw new NotFoundException('File not found');
    }
  }

  @Delete(':filename')
  @Roles('client', 'freelancer')
  async deleteFile(@Param('filename') filename: string) {
    const deleted = await this.uploadsService.deleteFile(filename);
    return { deleted };
  }
}