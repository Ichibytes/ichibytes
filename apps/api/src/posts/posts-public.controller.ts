import {
  Controller,
  Get,
  Param,
  Query,
  Version,
  Header,
  NotFoundException,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from "@nestjs/swagger";
import { PostsService } from "./posts.service";
import { PostQueryDto } from "./dto/post-query.dto";
import { Public } from "../core/decorators/public.decorator";
import { PaginatedResponseDto } from "../core/dto/pagination.dto";
import { PostStatus } from "@prisma/client";

@ApiTags("public")
@Public()
@Controller({
  path: "public/posts",
  version: "1",
})
export class PostsPublicController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  @Header("Cache-Control", "public, max-age=3600, stale-while-revalidate=86400")
  @ApiOperation({
    summary: "List published posts",
    description:
      "Get a paginated list of published posts. Public endpoint with caching.",
  })
  @ApiResponse({
    status: 200,
    description: "List of published posts",
    type: PaginatedResponseDto,
  })
  async findAll(@Query() query: PostQueryDto) {
    const publishedQuery: PostQueryDto = {
      ...query,
      status: [PostStatus.PUBLISHED],
    };
    return this.postsService.findAll(publishedQuery);
  }

  @Get(":slug")
  @Header("Cache-Control", "public, max-age=3600, stale-while-revalidate=86400")
  @ApiOperation({
    summary: "Get post by slug",
    description:
      "Get a single published post by its slug. Public endpoint with caching.",
  })
  @ApiParam({ name: "slug", description: "Post slug", type: String })
  @ApiResponse({
    status: 200,
    description: "Post details",
  })
  @ApiResponse({
    status: 404,
    description: "Post not found or not published",
  })
  async findBySlug(@Param("slug") slug: string) {
    const post = await this.postsService.findBySlug(slug);

    if (post.status !== PostStatus.PUBLISHED) {
      throw new NotFoundException("Post not found or not published");
    }

    return post;
  }
}
