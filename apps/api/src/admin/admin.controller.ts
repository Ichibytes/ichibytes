import { Controller, Get, Version } from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { Roles } from "../core/decorators/roles.decorator";
import { UserRole } from "@prisma/client";

@ApiTags("admin")
@ApiBearerAuth("JWT-auth")
@Controller({
  path: "admin",
  version: "1",
})
export class AdminController {
  @Get()
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @ApiOperation({
    summary: "Get admin information",
    description:
      "Protected endpoint that requires authentication and admin/editor role",
  })
  @ApiResponse({
    status: 200,
    description: "Admin information",
    schema: {
      type: "object",
      properties: {
        message: { type: "string", example: "Admin API endpoint" },
        version: { type: "string", example: "v1" },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized - Invalid or missing token",
  })
  @ApiResponse({
    status: 403,
    description: "Forbidden - Insufficient permissions",
  })
  getAdminInfo() {
    return {
      message: "Admin API endpoint",
      version: "v1",
    };
  }
}
