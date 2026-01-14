import { Controller, Get, Version } from "@nestjs/common";

@Controller({
  path: "public",
  version: "1",
})
export class PublicController {
  @Get()
  getPublicInfo() {
    return {
      message: "Public API endpoint",
      version: "v1",
    };
  }
}
