import { Controller, Get, Version } from "@nestjs/common";

@Controller({
  path: "admin",
  version: "1",
})
export class AdminController {
  @Get()
  getAdminInfo() {
    return {
      message: "Admin API endpoint",
      version: "v1",
    };
  }
}
