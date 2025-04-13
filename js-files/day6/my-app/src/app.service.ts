import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getTechStack(): string[] {
    return ['NestJS', 'TypeScript', 'Node.js','Java','.NET'];

  }

}


