import { Controller, Get, Version } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { AppService } from "./app.service";

@ApiTags("app")
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Version("1")
  @ApiOperation({
    summary: "Get API information",
    description:
      "Returns basic information about the API and available endpoints",
  })
  @ApiResponse({
    status: 200,
    description: "API information",
    schema: {
      type: "object",
      properties: {
        message: { type: "string", example: "Ichibytes API" },
        version: { type: "string", example: "v1" },
        endpoints: {
          type: "object",
          properties: {
            public: { type: "string", example: "/api/v1/public" },
            admin: { type: "string", example: "/api/v1/admin" },
            auth: { type: "string", example: "/api/v1/admin/auth" },
            health: { type: "string", example: "/api/v1/health" },
          },
        },
      },
    },
  })
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
