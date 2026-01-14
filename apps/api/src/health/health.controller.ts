import { Controller, Get, Version } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { SkipThrottle } from "@nestjs/throttler";
import { HealthService } from "./health.service";
import { Public } from "../core/decorators/public.decorator";

@ApiTags("health")
@Controller({
  path: "health",
  version: "1",
})
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Public()
  @SkipThrottle()
  @Get()
  @ApiOperation({
    summary: "Health check",
    description: "Returns the health status of the API",
  })
  @ApiResponse({
    status: 200,
    description: "API is healthy",
    schema: {
      type: "object",
      properties: {
        status: { type: "string", example: "ok" },
        timestamp: { type: "string", example: "2025-01-14T00:00:00.000Z" },
        uptime: { type: "number", example: 123.456 },
      },
    },
  })
  check() {
    return this.healthService.check();
  }

  @Public()
  @SkipThrottle()
  @Get("ready")
  @ApiOperation({
    summary: "Readiness check",
    description:
      "Returns the readiness status of the API and database connection",
  })
  @ApiResponse({
    status: 200,
    description: "API is ready",
    schema: {
      type: "object",
      properties: {
        status: { type: "string", example: "ready" },
        database: { type: "string", example: "connected" },
        timestamp: { type: "string", example: "2025-01-14T00:00:00.000Z" },
      },
    },
  })
  ready() {
    return this.healthService.ready();
  }

  @Public()
  @SkipThrottle()
  @Get("live")
  @ApiOperation({
    summary: "Liveness check",
    description: "Returns the liveness status of the API",
  })
  @ApiResponse({
    status: 200,
    description: "API is alive",
    schema: {
      type: "object",
      properties: {
        status: { type: "string", example: "alive" },
        timestamp: { type: "string", example: "2025-01-14T00:00:00.000Z" },
      },
    },
  })
  live() {
    return this.healthService.live();
  }
}
