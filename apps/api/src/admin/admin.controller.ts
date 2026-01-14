import { Controller, Get, Version } from "@nestjs/common";
import { Roles } from "../core/decorators/roles.decorator";
import { UserRole } from "@prisma/client";

@Controller({
  path: "admin",
  version: "1",
})
export class AdminController {
  @Get()
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  getAdminInfo() {
    return {
      message: "Admin API endpoint",
      version: "v1",
    };
  }
}
