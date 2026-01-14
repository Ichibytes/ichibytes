import { Controller, Get, Version } from "@nestjs/common";
import { Public } from "../core/decorators/public.decorator";

@Controller({
  path: "public",
  version: "1",
})
export class PublicController {
  @Public()
  @Get()
  getPublicInfo() {
    return {
      message: "Public API endpoint",
      version: "v1",
    };
  }
}
