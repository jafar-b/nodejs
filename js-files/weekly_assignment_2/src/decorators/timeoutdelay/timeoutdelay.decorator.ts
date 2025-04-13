// timeout.decorator.ts
import { RequestTimeoutException } from '@nestjs/common';

export function TimeoutDelay(delay: number) {
  return function (
    _target: any,
    _propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      return await Promise.race([
        originalMethod.apply(this, args),
        new Promise((_, reject) =>
          setTimeout(() => reject(new RequestTimeoutException()), delay),
        ),
      ]);
    };
  };
}
