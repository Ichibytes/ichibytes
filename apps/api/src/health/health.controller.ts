import { Controller, Get, Version } from "@nestjs/common";
import { HealthService } from "./health.service";
import { Public } from "../core/decorators/public.decorator";

@Controller({
  path: "health",
  version: "1",
})
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Public()
  @Get()
  check() {
    return this.healthService.check();
  }

  @Public()
  @Get("ready")
  ready() {
    return this.healthService.ready();
  }

  @Public()
  @Get("live")
  live() {
    return this.healthService.live();
  }
}
