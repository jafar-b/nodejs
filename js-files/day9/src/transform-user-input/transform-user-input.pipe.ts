import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { UserDto } from 'src/user/user-dto/user-dto';


@Injectable()
export class TransformUserPipe implements PipeTransform {
  transform(value: UserDto) {
    const email = value.email?.trim().toLowerCase();
    const age = Number(value.age);

    return value;
  }
}
