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
  Version,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiQuery,
} from "@nestjs/swagger";
import { PostsService } from "./posts.service";
import { CreatePostDto } from "./dto/create-post.dto";
import { UpdatePostDto } from "./dto/update-post.dto";
import { PostQueryDto } from "./dto/post-query.dto";
import { SchedulePostDto } from "./dto/schedule-post.dto";
import { Roles } from "../core/decorators/roles.decorator";
import {
  CurrentUser,
  CurrentUserPayload,
} from "../core/decorators/current-user.decorator";
import { UserRole } from "@prisma/client";
import { PaginatedResponseDto } from "../core/dto/pagination.dto";
import { PostStatus } from "@prisma/client";

@ApiTags("admin")
@ApiBearerAuth("JWT-auth")
@Controller({
  path: "admin/posts",
  version: "1",
})
export class PostsAdminController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @ApiOperation({
    summary: "List all posts",
    description:
      "Get a paginated list of all posts with filters. Requires admin or editor role.",
  })
  @ApiResponse({
    status: 200,
    description: "List of posts",
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
  async findAll(@Query() query: PostQueryDto) {
    return this.postsService.findAll(query);
  }

  @Get(":id")
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @ApiOperation({
    summary: "Get post by ID",
    description:
      "Get a single post by its ID. Includes revisions and full details.",
  })
  @ApiParam({ name: "id", description: "Post ID", type: String })
  @ApiResponse({
    status: 200,
    description: "Post details",
  })
  @ApiResponse({
    status: 404,
    description: "Post not found",
  })
  async findOne(@Param("id") id: string) {
    return this.postsService.findOne(id);
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: "Create new post",
    description:
      "Create a new blog post. The authenticated user will be set as the author.",
  })
  @ApiBody({ type: CreatePostDto })
  @ApiResponse({
    status: 201,
    description: "Post created successfully",
  })
  @ApiResponse({
    status: 400,
    description: "Validation error",
  })
  async create(
    @Body() createPostDto: CreatePostDto,
    @CurrentUser() user: CurrentUserPayload
  ) {
    return this.postsService.create(createPostDto, user.userId);
  }

  @Patch(":id")
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @ApiOperation({
    summary: "Update post",
    description:
      "Update an existing post. Automatically creates a revision if content changes.",
  })
  @ApiParam({ name: "id", description: "Post ID", type: String })
  @ApiBody({ type: UpdatePostDto })
  @ApiResponse({
    status: 200,
    description: "Post updated successfully",
  })
  @ApiResponse({
    status: 404,
    description: "Post not found",
  })
  async update(
    @Param("id") id: string,
    @Body() updatePostDto: UpdatePostDto,
    @CurrentUser() user: CurrentUserPayload
  ) {
    return this.postsService.update(id, updatePostDto, user.userId);
  }

  @Delete(":id")
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: "Delete post",
    description: "Permanently delete a post. This action cannot be undone.",
  })
  @ApiParam({ name: "id", description: "Post ID", type: String })
  @ApiResponse({
    status: 204,
    description: "Post deleted successfully",
  })
  @ApiResponse({
    status: 404,
    description: "Post not found",
  })
  async remove(@Param("id") id: string) {
    await this.postsService.remove(id);
  }

  @Post(":id/publish")
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @ApiOperation({
    summary: "Publish post",
    description:
      "Publish a post. Sets status to PUBLISHED and publishedAt to current time.",
  })
  @ApiParam({ name: "id", description: "Post ID", type: String })
  @ApiResponse({
    status: 200,
    description: "Post published successfully",
  })
  @ApiResponse({
    status: 400,
    description: "Post is already published",
  })
  @ApiResponse({
    status: 404,
    description: "Post not found",
  })
  async publish(@Param("id") id: string) {
    return this.postsService.publish(id);
  }

  @Post(":id/unpublish")
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @ApiOperation({
    summary: "Unpublish post",
    description:
      "Unpublish a post. Sets status to DRAFT and clears publishedAt.",
  })
  @ApiParam({ name: "id", description: "Post ID", type: String })
  @ApiResponse({
    status: 200,
    description: "Post unpublished successfully",
  })
  @ApiResponse({
    status: 400,
    description: "Post is not published",
  })
  @ApiResponse({
    status: 404,
    description: "Post not found",
  })
  async unpublish(@Param("id") id: string) {
    return this.postsService.unpublish(id);
  }

  @Post(":id/archive")
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @ApiOperation({
    summary: "Archive post",
    description: "Archive a post. Sets status to ARCHIVED.",
  })
  @ApiParam({ name: "id", description: "Post ID", type: String })
  @ApiResponse({
    status: 200,
    description: "Post archived successfully",
  })
  @ApiResponse({
    status: 404,
    description: "Post not found",
  })
  async archive(@Param("id") id: string) {
    return this.postsService.archive(id);
  }

  @Post(":id/schedule")
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @ApiOperation({
    summary: "Schedule post",
    description:
      "Schedule a post for future publication. Sets status to SCHEDULED and scheduledAt date.",
  })
  @ApiParam({ name: "id", description: "Post ID", type: String })
  @ApiBody({ type: SchedulePostDto })
  @ApiResponse({
    status: 200,
    description: "Post scheduled successfully",
  })
  @ApiResponse({
    status: 400,
    description: "Invalid scheduled date",
  })
  @ApiResponse({
    status: 404,
    description: "Post not found",
  })
  async schedule(
    @Param("id") id: string,
    @Body() schedulePostDto: SchedulePostDto,
    @CurrentUser() user: CurrentUserPayload
  ) {
    return this.postsService.update(
      id,
      {
        scheduledAt: schedulePostDto.scheduledAt,
        status: PostStatus.SCHEDULED,
      },
      user.userId
    );
  }
}
