import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseInterceptors,
  UploadedFile,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from "@nestjs/swagger";
import { MediaService, MulterFile } from "./media.service";
import { MediaQueryDto } from "./dto/media-query.dto";
import { ConfirmUploadDto } from "./dto/confirm-upload.dto";
import { GenerateUploadUrlDto } from "./dto/generate-upload-url.dto";
import { Roles } from "../core/decorators/roles.decorator";
import {
  CurrentUser,
  CurrentUserPayload,
} from "../core/decorators/current-user.decorator";
import { UserRole } from "@prisma/client";
import { PaginatedResponseDto } from "../core/dto/pagination.dto";

@ApiTags("media")
@ApiBearerAuth("JWT-auth")
@Controller("api/v1/admin/media")
@Roles(UserRole.ADMIN, UserRole.EDITOR)
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post("upload")
  @UseInterceptors(FileInterceptor("file"))
  @ApiOperation({
    summary: "Upload a file",
    description:
      "Upload a file directly to S3. Images are automatically optimized.",
  })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        file: {
          type: "string",
          format: "binary",
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: "File uploaded successfully",
  })
  @ApiResponse({
    status: 400,
    description: "Invalid file type or size",
  })
  async uploadFile(
    @UploadedFile() file: MulterFile | undefined,
    @CurrentUser() user: CurrentUserPayload
  ) {
    if (!file) {
      throw new BadRequestException("File is required");
    }
    return this.mediaService.uploadFile(file, user.userId);
  }

  @Post("upload-url")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Generate signed upload URL",
    description:
      "Generate a presigned URL for direct client-side uploads to S3.",
  })
  @ApiBody({ type: GenerateUploadUrlDto })
  @ApiResponse({
    status: 200,
    description: "Signed upload URL generated",
    schema: {
      type: "object",
      properties: {
        url: { type: "string" },
        key: { type: "string" },
        expiresIn: { type: "number" },
      },
    },
  })
  async generateUploadUrl(
    @Body() dto: GenerateUploadUrlDto,
    @CurrentUser() user: CurrentUserPayload
  ) {
    return this.mediaService.generateSignedUploadUrl(
      dto.filename,
      dto.contentType,
      user.userId
    );
  }

  @Post("confirm-upload")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: "Confirm file upload",
    description:
      "Confirm that a file was uploaded using a signed URL and create a media record.",
  })
  @ApiBody({ type: ConfirmUploadDto })
  @ApiResponse({
    status: 201,
    description: "Upload confirmed and media record created",
  })
  @ApiResponse({
    status: 400,
    description: "File not found in storage",
  })
  async confirmUpload(
    @Body() dto: ConfirmUploadDto,
    @CurrentUser() user: CurrentUserPayload
  ) {
    return this.mediaService.confirmUpload(
      dto.key,
      dto.filename,
      dto.mimeType,
      dto.size,
      user.userId
    );
  }

  @Get()
  @ApiOperation({
    summary: "List all media",
    description: "Get a paginated list of all media files.",
  })
  @ApiResponse({
    status: 200,
    description: "List of media files",
    type: PaginatedResponseDto,
  })
  async findAll(@Query() query: MediaQueryDto) {
    return this.mediaService.findAll(query);
  }

  @Get("stats")
  @ApiOperation({
    summary: "Get media statistics",
    description: "Get statistics about media files (total, size, by type).",
  })
  @ApiResponse({
    status: 200,
    description: "Media statistics",
  })
  async getStats() {
    return this.mediaService.getMediaStats();
  }

  @Get("my")
  @ApiOperation({
    summary: "Get my media",
    description:
      "Get a paginated list of media files uploaded by the current user.",
  })
  @ApiResponse({
    status: 200,
    description: "List of user's media files",
    type: PaginatedResponseDto,
  })
  async findMyMedia(
    @Query() query: MediaQueryDto,
    @CurrentUser() user: CurrentUserPayload
  ) {
    return this.mediaService.findByUploader(user.userId, query);
  }

  @Get(":id")
  @ApiOperation({
    summary: "Get media by ID",
    description: "Get a single media file by its ID.",
  })
  @ApiParam({ name: "id", description: "Media ID", type: String })
  @ApiResponse({
    status: 200,
    description: "Media file details",
  })
  @ApiResponse({
    status: 404,
    description: "Media not found",
  })
  async findOne(@Param("id") id: string) {
    return this.mediaService.findOne(id);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Delete media",
    description: "Delete a media file from both database and S3 storage.",
  })
  @ApiParam({ name: "id", description: "Media ID", type: String })
  @ApiResponse({
    status: 200,
    description: "Media deleted successfully",
  })
  @ApiResponse({
    status: 404,
    description: "Media not found",
  })
  async remove(@Param("id") id: string) {
    return this.mediaService.remove(id);
  }
}
