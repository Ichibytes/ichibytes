import { Controller, Get, Query, Param } from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from "@nestjs/swagger";
import { AuditLogService } from "./audit-log.service";
import { AuditLogQueryDto } from "./dto/audit-log-query.dto";
import { Roles } from "../core/decorators/roles.decorator";
import { UserRole } from "@prisma/client";
import { PaginatedResponseDto } from "../core/dto/pagination.dto";

@ApiTags("admin")
@ApiBearerAuth("JWT-auth")
@Controller({
  path: "admin/audit-logs",
  version: "1",
})
export class AuditLogController {
  constructor(private readonly auditLogService: AuditLogService) {}

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: "List audit logs",
    description:
      "Get a paginated list of audit logs with filtering. Requires admin role.",
  })
  @ApiResponse({
    status: 200,
    description: "List of audit logs",
    type: PaginatedResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized - Invalid or missing token",
  })
  @ApiResponse({
    status: 403,
    description: "Forbidden - Insufficient permissions (admin only)",
  })
  async findAll(@Query() query: AuditLogQueryDto) {
    return this.auditLogService.findAll(query);
  }

  @Get("resource/:resourceType/:resourceId")
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: "Get audit logs for a resource",
    description:
      "Get audit logs for a specific resource (e.g., post, project). Requires admin role.",
  })
  @ApiParam({
    name: "resourceType",
    description: "Resource type (post, project, user, etc.)",
    type: String,
  })
  @ApiParam({
    name: "resourceId",
    description: "Resource ID",
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: "List of audit logs for the resource",
    type: PaginatedResponseDto,
  })
  async findByResource(
    @Param("resourceType") resourceType: string,
    @Param("resourceId") resourceId: string,
    @Query() query: AuditLogQueryDto
  ) {
    return this.auditLogService.findByResource(resourceType, resourceId, {
      page: query.page,
      limit: query.limit,
    });
  }

  @Get("user/:userId")
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: "Get audit logs for a user",
    description: "Get audit logs for a specific user. Requires admin role.",
  })
  @ApiParam({
    name: "userId",
    description: "User ID",
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: "List of audit logs for the user",
    type: PaginatedResponseDto,
  })
  async findByUser(
    @Param("userId") userId: string,
    @Query() query: AuditLogQueryDto
  ) {
    return this.auditLogService.findByUser(userId, {
      page: query.page,
      limit: query.limit,
    });
  }
}
