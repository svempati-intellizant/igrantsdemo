import { Injectable } from "@nestjs/common";
import { UsersRepository } from "./users.repository";

@Injectable()
export class UsersService {
  constructor(private userRepository: UsersRepository) {}
  //Find the User by email ID
  findOneByEmail(email: string) {
    return this.userRepository.findOneByEmail(email);
  }
}
