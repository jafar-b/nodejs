
import { AppService } from './app.service';
import {  Controller,  Post,  Get,  UploadedFile,  UploadedFiles,UseInterceptors,} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('single')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, callback) => {
        const unique = Date.now() + extname(file.originalname);
        callback(null, `${file.fieldname}-${unique}`);
      },
    }),
  }))
  uploadSingle(@UploadedFile() file: Express.Multer.File) {
    return { file };
  }

  @Post('multiple')
  @UseInterceptors(FilesInterceptor('files', 5, {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, callback) => {
        const unique = Date.now() + extname(file.originalname);
        callback(null, `${file.fieldname}-${unique}`);
      },
    }),
  }))
  uploadMultiple(@UploadedFiles() files: Express.Multer.File[]) {
    return { files };
  }



  @Post('buffer')
  @UseInterceptors(FileInterceptor('file'))
  handleBuffer(@UploadedFile() file: Express.Multer.File) {
    const base64 = file.buffer.toString('base64');
    return {
      originalName: file.originalname,
      size: file.size,
      base64Preview: base64.slice(0, 100) + '...',
    };
  }








}
