import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {

showUserDetails(id:number,role:string){
    const users=[ {
        "id": "1",
        "email": "user1@example.com",
        "name": "UserOne",
        "password": "User12345",
        "description": "This is mock user data for UserOne."
      },
      {
        "id": "2",
        "email": "user2@example.com",
        "name": "UserTwo",
        "password": "User67890",
        "description": "This is mock user data for UserTwo."
      },
      {
        "id": "3",
        "email": "user3@example.com",
        "name": "UserThree",
        "password": "User11111",
        "description": "This is mock user data for UserThree."
      },
      {
        "id": "4",
        "email": "user4@example.com",
        "name": "UserFour",
        "password": "User22222",
        "description": "This is mock user data for UserFour."
      }]
  if(role==="admin"){
    return {id,email:"adminuser@gmail.com",name:"AdminUser",password:"Admin123",description:"This is mock admin data."}
  }
  if(role==="user"){
    return users.find((user)=>Number(user.id)==id)
  }
      return {id,role}
}


}
