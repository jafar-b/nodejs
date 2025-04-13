import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
  } from 'class-validator';
  
  @ValidatorConstraint({ name: 'PostalCodeValidator', async: false })
  export class PostalValidator implements ValidatorConstraintInterface {
    validate(code: string, args: ValidationArguments) {
        const object: any = args.object;
        console.log('Validation Object:', object); // debugging
        const country = object.country; 
      
        const countryRegex = {
          US: /^\d{5}(-\d{4})?$/,
          UK: /^[A-Z]{1,2}\d[A-Z\d]? \d[A-Z]{2}$/,
          IN: /^\d{6}$/,
        };
      
        return countryRegex[country]?.test(code);
      }
      
  
    defaultMessage(args: ValidationArguments) {
      return 'INVALID_POSTAL_CODE';
    }
  }
  