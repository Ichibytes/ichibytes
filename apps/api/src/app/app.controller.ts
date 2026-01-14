import { Controller, Get, Version } from "@nestjs/common";
import { AppService } from "./app.service";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Version("1")
  getData() {
    return {
      message: "Ichibytes API",
      version: "v1",
      endpoints: {
        public: "/api/v1/public",
        admin: "/api/v1/admin",
        auth: "/api/v1/admin/auth",
        health: "/api/v1/health",
      },
    };
  }
}
