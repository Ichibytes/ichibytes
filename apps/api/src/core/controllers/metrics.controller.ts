import { Controller, Get, Version } from "@nestjs/common";
import { Public } from "../decorators/public.decorator";
import { metricsCollector } from "../utils/metrics.util";

@Controller({
  path: "metrics",
  version: "1",
})
export class MetricsController {
  @Public()
  @Get()
  getMetrics() {
    return metricsCollector.getSummary();
  }
}
