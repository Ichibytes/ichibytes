import { Controller, Get, Version } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { Public } from "../core/decorators/public.decorator";

@ApiTags("public")
@Controller({
  path: "public",
  version: "1",
})
export class PublicController {
  @Public()
  @Get()
  @ApiOperation({
    summary: "Get public information",
    description: "Public endpoint that does not require authentication",
  })
  @ApiResponse({
    status: 200,
    description: "Public information",
    schema: {
      type: "object",
      properties: {
        message: { type: "string", example: "Public API endpoint" },
        version: { type: "string", example: "v1" },
      },
    },
  })
  getPublicInfo() {
    return {
      message: "Public API endpoint",
      version: "v1",
    };
  }
}
