import { Controller, Get, Version } from "@nestjs/common";
import { SkipThrottle } from "@nestjs/throttler";
import { HealthService } from "./health.service";
import { Public } from "../core/decorators/public.decorator";

@Controller({
  path: "health",
  version: "1",
})
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Public()
  @SkipThrottle()
  @Get()
  check() {
    return this.healthService.check();
  }

  @Public()
  @SkipThrottle()
  @Get("ready")
  ready() {
    return this.healthService.ready();
  }

  @Public()
  @SkipThrottle()
  @Get("live")
  live() {
    return this.healthService.live();
  }
}
