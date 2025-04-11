import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {

    createUser(name: string) {
        return { id: 1, name };
      }

      findUserById(id: number) {
       return { id, name: 'Jafar Beldar' };
      }

}
