import { Module } from '@nestjs/common';
import { UploadsController } from './uploads.controller';
import { UploadsService } from './uploads.service';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
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
          log('Upload destination path:', uploadPath);
          if (!existsSync(uploadPath)) {
            log('Creating uploads directory');
            mkdirSync(uploadPath, { recursive: true });
          }
          callback(null, uploadPath);
        },
        filename: (req, file, callback) => {
          // Use original filename + timestamp to avoid conflicts
          const originalName = file.originalname;
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          const ext = extname(originalName);
          const generatedFilename = `${uniqueSuffix}${ext}`;
          
          log('Original filename:', originalName);
          log('Generated filename:', generatedFilename);
          
          callback(null, generatedFilename);
        },
      }),
      fileFilter: (req, file, callback) => {
        log('File filter checking:', file.originalname, file.mimetype);
        // Accept more image types and be more permissive
        if (!file.mimetype.match(/^image\//)) {
          log('File rejected: not an image');
          return callback(new Error('Only image files are allowed!'), false);
        }
        log('File accepted');
        callback(null, true);
      },
      limits: {
        fileSize: 1024 * 1024 * 10, // 10MB
      },
    }),
  ],
  controllers: [UploadsController],
  providers: [UploadsService],
  exports: [UploadsService],
})
export class UploadsModule {}