import { Injectable } from "@nestjs/common";
import { SharedService } from "src/shared/shared.service";
import { RoleRepository } from "./role.repository";

@Injectable()
export class RoleService {
  constructor(private roleRepository: RoleRepository) {}
  //Get all Roles with permissions
  getAllRoles = async (name: string) => await this.roleRepository.getRole(name);
}
