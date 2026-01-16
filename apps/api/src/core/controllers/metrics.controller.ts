import { Controller, Get } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { Public } from "../decorators/public.decorator";
import { metricsCollector } from "../utils/metrics.util";

@ApiTags("metrics")
@Controller({
  path: "metrics",
  version: "1",
})
export class MetricsController {
  @Public()
  @Get()
  @ApiOperation({
    summary: "Get API metrics",
    description:
      "Returns basic metrics about API usage including request counts, errors, and response times",
  })
  @ApiResponse({
    status: 200,
    description: "Metrics summary",
    schema: {
      type: "object",
      properties: {
        totalRequests: { type: "number", example: 1000 },
        errorCount: { type: "number", example: 5 },
        averageResponseTime: { type: "number", example: 45 },
        requestsByStatus: {
          type: "object",
          example: { "200": 950, "400": 30, "500": 5 },
        },
        requestsByEndpoint: {
          type: "object",
          example: { "/api/v1/public": 500, "/api/v1/admin": 300 },
        },
      },
    },
  })
  getMetrics() {
    return metricsCollector.getSummary();
  }
}
