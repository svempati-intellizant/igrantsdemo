import { Controller, Get, UseGuards } from "@nestjs/common";
import { RoleGuard } from "../shared/guards/role.guard";
import { AuthGuard } from "@nestjs/passport";
import { ApiResponse, ApiBearerAuth } from "@nestjs/swagger";
import { RoleService } from "./role.service";
import { CurrentUser } from "../shared/decorators/user.decorator";
import { User } from "../users/entities/user.entity";

@Controller("role")
export class RoleController {
  constructor(private roleService: RoleService) {}
  @Get()
  @ApiBearerAuth("access-token")
  @ApiResponse({ status: 200, description: "Returned Roles" })
  @UseGuards(AuthGuard("jwt"), RoleGuard)
  fetchAllRoles(@CurrentUser() user: User) {
    return this.roleService.getAllRoles(user.role);
  }
}
