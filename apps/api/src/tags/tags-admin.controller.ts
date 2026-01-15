import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiParam,
} from "@nestjs/swagger";
import { TagsService } from "./tags.service";
import { CreateTagDto } from "./dto/create-tag.dto";
import { UpdateTagDto } from "./dto/update-tag.dto";
import { TagQueryDto } from "./dto/tag-query.dto";
import { Roles } from "../core/decorators/roles.decorator";
import { UserRole } from "@prisma/client";
import { PaginatedResponseDto } from "../core/dto/pagination.dto";

@ApiTags("admin")
@ApiBearerAuth("JWT-auth")
@Controller({
  path: "admin/tags",
  version: "1",
})
export class TagsAdminController {
  constructor(private readonly tagsService: TagsService) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @ApiOperation({
    summary: "List all tags",
    description:
      "Get a paginated list of all tags with filters. Requires admin or editor role.",
  })
  @ApiResponse({
    status: 200,
    description: "List of tags",
    type: PaginatedResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized - Invalid or missing token",
  })
  @ApiResponse({
    status: 403,
    description: "Forbidden - Insufficient permissions",
  })
  async findAll(@Query() query: TagQueryDto) {
    return this.tagsService.findAll(query);
  }

  @Get(":id")
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @ApiOperation({
    summary: "Get tag by ID",
    description: "Get a single tag by its ID with usage statistics.",
  })
  @ApiParam({ name: "id", description: "Tag ID", type: String })
  @ApiResponse({
    status: 200,
    description: "Tag details",
  })
  @ApiResponse({
    status: 404,
    description: "Tag not found",
  })
  async findOne(@Param("id") id: string) {
    return this.tagsService.findOne(id);
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: "Create new tag",
    description: "Create a new tag. Slug is auto-generated if not provided.",
  })
  @ApiBody({ type: CreateTagDto })
  @ApiResponse({
    status: 201,
    description: "Tag created successfully",
  })
  @ApiResponse({
    status: 400,
    description: "Validation error",
  })
  @ApiResponse({
    status: 409,
    description: "Tag with same name or slug already exists",
  })
  async create(@Body() createTagDto: CreateTagDto) {
    return this.tagsService.create(createTagDto);
  }

  @Patch(":id")
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @ApiOperation({
    summary: "Update tag",
    description:
      "Update an existing tag. Slug is auto-generated if name changes.",
  })
  @ApiParam({ name: "id", description: "Tag ID", type: String })
  @ApiBody({ type: UpdateTagDto })
  @ApiResponse({
    status: 200,
    description: "Tag updated successfully",
  })
  @ApiResponse({
    status: 404,
    description: "Tag not found",
  })
  @ApiResponse({
    status: 409,
    description: "Tag with same name or slug already exists",
  })
  async update(@Param("id") id: string, @Body() updateTagDto: UpdateTagDto) {
    return this.tagsService.update(id, updateTagDto);
  }

  @Delete(":id")
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: "Delete tag",
    description:
      "Permanently delete a tag. Cannot delete tags that are in use by posts or projects.",
  })
  @ApiParam({ name: "id", description: "Tag ID", type: String })
  @ApiResponse({
    status: 204,
    description: "Tag deleted successfully",
  })
  @ApiResponse({
    status: 400,
    description: "Tag is in use and cannot be deleted",
  })
  @ApiResponse({
    status: 404,
    description: "Tag not found",
  })
  async remove(@Param("id") id: string) {
    await this.tagsService.remove(id);
  }
}
