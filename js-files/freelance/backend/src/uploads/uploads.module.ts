import { Module, Logger } from '@nestjs/common';
import { UploadsController } from './uploads.controller';
import { UploadsService } from './uploads.service';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File } from 'src/entities/file.entity';
import { existsSync, mkdirSync } from 'fs';
import { log } from 'console';

@Module({
  imports: [
    TypeOrmModule.forFeature([File]),
    MulterModule.register({
      storage: diskStorage({
        destination: (req, file, callback) => {
          const uploadPath = './uploads';
          if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath);
          }
          callback(null, uploadPath);
        },
        filename: (req, file, callback) => {
          const randomName = uuidv4();
          const generatedFilename = `${randomName}${extname(file.originalname)}`;
          log(`Generated filename: ${generatedFilename}`); // Log the filename
          callback(null, generatedFilename);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif|pdf|doc|docx|xls|xlsx)$/)) {
          return callback(new Error('Only image and document files are allowed!'), false);
        }
        callback(null, true);
      },
      limits: {
        fileSize: 1024 * 1024 * 5, // 5MB
      },
    }),
  ],
  controllers: [UploadsController],
  providers: [UploadsService],
  exports: [UploadsService, UploadsModule],
})
export class UploadsModule {}