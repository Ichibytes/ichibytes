import { Controller, Post, Body, HttpCode, HttpStatus } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from "@nestjs/swagger";
import { ContactService } from "./contact.service";
import { ContactDto } from "./dto/contact.dto";
import { Public } from "../core/decorators/public.decorator";

@ApiTags("public")
@Public()
@Controller({
  path: "public/contact",
  version: "1",
})
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Send contact message",
    description: "Submit a contact form message. Rate limited to prevent spam.",
  })
  @ApiBody({ type: ContactDto })
  @ApiResponse({
    status: 200,
    description: "Message sent successfully",
    schema: {
      type: "object",
      properties: {
        success: { type: "boolean", example: true },
        message: {
          type: "string",
          example:
            "Your message has been received. We'll get back to you soon!",
        },
        timestamp: {
          type: "string",
          example: "2025-01-14T00:00:00.000Z",
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: "Validation error",
  })
  @ApiResponse({
    status: 429,
    description: "Too many requests (rate limited)",
  })
  async sendMessage(@Body() contactDto: ContactDto) {
    return this.contactService.sendContactMessage(contactDto);
  }
}
