import { Injectable } from '@nestjs/common';
import { EmploymentDto } from '../dto/employment.dto';

@Injectable()
export class EmploymentValidator {
  private readonly HOURLY_RATE_RANGE = {
    US: [20, 100],
    EU: [15, 80],
  };

  private readonly DEFAULT_RANGE = [15, 100];

  validateEmployment(dto: EmploymentDto, countryCode?: string): ValidationErrors | null {
    const errors: ValidationErrors = {};
    
    // validates fullTimeDetails when employmentType is full-time
    if (dto.employmentType === 'full-time') {
      if (!dto.fullTimeDetails) {
        errors['fullTimeDetails'] = {
          code: 'REQUIRED_FIELD',
          message: 'Full time details are required for full-time employment'
        };
      } else {
        // validate joining date is in the future
        const now = new Date();
        if (dto.fullTimeDetails.joiningDate <= now) {
          errors['fullTimeDetails.joiningDate'] = {
            code: 'INVALID_DATE',
            message: 'Joining date must be in the future'
          };
        }

        // validate at least one benefit
        if (!dto.fullTimeDetails.benefits || dto.fullTimeDetails.benefits.length === 0) {
          errors['fullTimeDetails.benefits'] = {
            code: 'EMPTY_ARRAY',
            message: 'At least one benefit must be provided'
          };
        }
      }
    }

    // validate contractorDetails when employmentType is contractor
    if (dto.employmentType === 'contractor') {
      if (!dto.contractorDetails) {
        errors['contractorDetails'] = {
          code: 'REQUIRED_FIELD',
          message: 'Contractor details are required for contractor employment'
        };
      } else {
        // validate contract end date is after start date (assuming current date as start)
        const now = new Date();
        if (dto.contractorDetails.contractEnd <= now) {
          errors['contractorDetails.contractEnd'] = {
            code: 'INVALID_DATE',
            message: 'Contract end date must be after the current date'
          };
        }

        // validate hourly rate based on locale
        const range = countryCode && this.HOURLY_RATE_RANGE[countryCode] ? this.HOURLY_RATE_RANGE[countryCode] : this.DEFAULT_RANGE;
        if (dto.contractorDetails.hourlyRate < range[0] || dto.contractorDetails.hourlyRate > range[1]) {
          errors['contractorDetails.hourlyRate'] = {
            code: 'RATE_OUT_OF_RANGE',
            allowedRanges: {
              [countryCode || 'default']: range
            }
          };
        }
      }
    }

    // validate metadata
    if (dto.metadata) {
      Object.keys(dto.metadata).forEach(key => {
        if (!key.match(/^[a-z0-9_]+$/)) {
          errors[`metadata.${key}`] = {
            code: 'INVALID_KEY_FORMAT',
            message: 'Metadata keys must match /^[a-z0-9_]+$/'
          };
        }
        
        if (dto.metadata[key] && dto.metadata[key].length > 255) {
          errors[`metadata.${key}`] = {
            code: 'VALUE_TOO_LONG',
            message: 'Metadata values must be at most 255 characters'
          };
        }
      });
    }

    return Object.keys(errors).length > 0 ? { errors } : null;
  }
}

export interface ValidationErrors {
  [key: string]: any;
}