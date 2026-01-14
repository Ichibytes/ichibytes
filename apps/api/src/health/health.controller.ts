import { Controller, Get, Version } from "@nestjs/common";
import { HealthService } from "./health.service";

@Controller({
  path: "health",
  version: "1",
})
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  check() {
    return this.healthService.check();
  }

  @Get("ready")
  ready() {
    return this.healthService.ready();
  }

  @Get("live")
  live() {
    return this.healthService.live();
  }
}
