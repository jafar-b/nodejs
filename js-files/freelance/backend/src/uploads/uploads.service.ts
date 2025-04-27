import { Injectable, NotFoundException } from '@nestjs/common';
import { existsSync, unlinkSync } from 'fs';
import { join } from 'path';

@Injectable()
export class UploadsService {
  private readonly uploadsDir = './uploads';

  getFileUrl(filename: string): string {
    return `/uploads/${filename}`;
  }

  getFilePath(filename: string): string {
    return join(this.uploadsDir, filename);
  }

  async deleteFile(filename: string): Promise<boolean> {
    const filePath = this.getFilePath(filename);
    
    if (!existsSync(filePath)) {
      throw new NotFoundException(`File ${filename} not found`);
    }
    
    try {
      unlinkSync(filePath);
      return true;
    } catch (error) {
      return false;
    }
  }
} 