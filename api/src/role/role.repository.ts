import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Role } from "./role.entity";
import { Model } from "mongoose";
import { RoleDocument } from "./role.schema";
import { User } from "src/users/entities/user.entity";

@Injectable()
export class RoleRepository {
  constructor(@InjectModel(Role.name) private roleModel: Model<RoleDocument>) {}

  getRole(name: string) {
    return this.roleModel.findOne({ name }).lean();
  }
}
