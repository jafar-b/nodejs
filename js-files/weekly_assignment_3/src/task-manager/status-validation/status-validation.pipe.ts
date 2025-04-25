import { PipeTransform, BadRequestException } from '@nestjs/common';

export class StatusValidationPipe implements PipeTransform {
  readonly allowedStatuses = ['OPEN', 'DONE'];

  transform(value: any) {

    if (!value.status || typeof value.status !== 'string') {
      throw new BadRequestException(
        `"${JSON.stringify(value)}" is an invalid object. The "status" field must be a string. Allowed statuses are: ${this.allowedStatuses.join(', ')}`,
      );
    }

    const status = value.status.toUpperCase(); 

    if (!this.isStatusValid(status)) {
      throw new BadRequestException(
        `"${status}" is an invalid status. Allowed statuses are: ${this.allowedStatuses.join(', ')}`,
      );
    }

   
    value.status = status;
    return value;
  }

  private isStatusValid(status: string): boolean {
    return this.allowedStatuses.includes(status);
  }
}
