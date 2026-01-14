import { ApiProperty } from "@nestjs/swagger";

export class ResponseDto<T> {
  @ApiProperty({ description: "Response data" })
  data: T;

  @ApiProperty({
    description: "Response metadata",
    example: { timestamp: "2025-01-14T00:00:00.000Z" },
  })
  meta?: {
    timestamp?: string;
    [key: string]: unknown;
  };
}

export class ErrorResponseDto {
  @ApiProperty({
    description: "Error information",
    example: {
      code: "VALIDATION_ERROR",
      message: "Validation failed",
      details: { field: "email", reason: "Email is required" },
    },
  })
  error: {
    code: string;
    message: string;
    details?: unknown;
  };

  @ApiProperty({
    description: "Response metadata",
    example: {
      timestamp: "2025-01-14T00:00:00.000Z",
      requestId: "uuid",
    },
  })
  meta: {
    timestamp: string;
    requestId?: string;
    [key: string]: unknown;
  };
}
