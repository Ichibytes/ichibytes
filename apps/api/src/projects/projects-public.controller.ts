import {
  Controller,
  Get,
  Param,
  Query,
  Header,
  NotFoundException,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from "@nestjs/swagger";
import { ProjectsService } from "./projects.service";
import { ProjectQueryDto } from "./dto/project-query.dto";
import { Public } from "../core/decorators/public.decorator";
import { PaginatedResponseDto } from "../core/dto/pagination.dto";

@ApiTags("public")
@Public()
@Controller({
  path: "public/projects",
  version: "1",
})
export class ProjectsPublicController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  @Header("Cache-Control", "public, max-age=3600, stale-while-revalidate=86400")
  @ApiOperation({
    summary: "List projects",
    description:
      "Get a paginated list of projects. Public endpoint with caching.",
  })
  @ApiResponse({
    status: 200,
    description: "List of projects",
    type: PaginatedResponseDto,
  })
  async findAll(@Query() query: ProjectQueryDto) {
    return this.projectsService.findAll(query);
  }

  @Get(":slug")
  @Header("Cache-Control", "public, max-age=3600, stale-while-revalidate=86400")
  @ApiOperation({
    summary: "Get project by slug",
    description:
      "Get a single project by its slug. Public endpoint with caching.",
  })
  @ApiParam({ name: "slug", description: "Project slug", type: String })
  @ApiResponse({
    status: 200,
    description: "Project details",
  })
  @ApiResponse({
    status: 404,
    description: "Project not found",
  })
  async findBySlug(@Param("slug") slug: string) {
    try {
      return await this.projectsService.findBySlug(slug);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException("Project not found");
    }
  }
}
