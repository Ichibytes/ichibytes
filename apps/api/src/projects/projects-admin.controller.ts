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
import { IsArray, ValidateNested, IsString, IsInt, Min } from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { ProjectsService } from "./projects.service";
import { CreateProjectDto } from "./dto/create-project.dto";
import { UpdateProjectDto } from "./dto/update-project.dto";
import { ProjectQueryDto } from "./dto/project-query.dto";
import { Roles } from "../core/decorators/roles.decorator";
import { UserRole } from "@prisma/client";
import { PaginatedResponseDto } from "../core/dto/pagination.dto";

class ProjectOrderDto {
  @ApiProperty({
    description: "Project ID",
    example: "uuid",
  })
  @IsString()
  id: string;

  @ApiProperty({
    description: "Display order (lower numbers appear first)",
    example: 0,
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  order: number;
}

export class ReorderProjectsDto {
  @ApiProperty({
    description: "Array of projects with their new order values",
    type: [ProjectOrderDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProjectOrderDto)
  projects: ProjectOrderDto[];
}

@ApiTags("admin")
@ApiBearerAuth("JWT-auth")
@Controller({
  path: "admin/projects",
  version: "1",
})
export class ProjectsAdminController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @ApiOperation({
    summary: "List all projects",
    description:
      "Get a paginated list of all projects with filters. Requires admin or editor role.",
  })
  @ApiResponse({
    status: 200,
    description: "List of projects",
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
  async findAll(@Query() query: ProjectQueryDto) {
    return this.projectsService.findAll(query);
  }

  @Get(":id")
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @ApiOperation({
    summary: "Get project by ID",
    description: "Get a single project by its ID with full details.",
  })
  @ApiParam({ name: "id", description: "Project ID", type: String })
  @ApiResponse({
    status: 200,
    description: "Project details",
  })
  @ApiResponse({
    status: 404,
    description: "Project not found",
  })
  async findOne(@Param("id") id: string) {
    return this.projectsService.findOne(id);
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: "Create new project",
    description: "Create a new project.",
  })
  @ApiBody({ type: CreateProjectDto })
  @ApiResponse({
    status: 201,
    description: "Project created successfully",
  })
  @ApiResponse({
    status: 400,
    description: "Validation error",
  })
  async create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.create(createProjectDto);
  }

  @Patch(":id")
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @ApiOperation({
    summary: "Update project",
    description: "Update an existing project.",
  })
  @ApiParam({ name: "id", description: "Project ID", type: String })
  @ApiBody({ type: UpdateProjectDto })
  @ApiResponse({
    status: 200,
    description: "Project updated successfully",
  })
  @ApiResponse({
    status: 404,
    description: "Project not found",
  })
  async update(
    @Param("id") id: string,
    @Body() updateProjectDto: UpdateProjectDto
  ) {
    return this.projectsService.update(id, updateProjectDto);
  }

  @Delete(":id")
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: "Delete project",
    description: "Permanently delete a project. This action cannot be undone.",
  })
  @ApiParam({ name: "id", description: "Project ID", type: String })
  @ApiResponse({
    status: 204,
    description: "Project deleted successfully",
  })
  @ApiResponse({
    status: 404,
    description: "Project not found",
  })
  async remove(@Param("id") id: string) {
    await this.projectsService.remove(id);
  }

  @Patch(":id/featured")
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @ApiOperation({
    summary: "Toggle featured status",
    description: "Toggle the featured status of a project.",
  })
  @ApiParam({ name: "id", description: "Project ID", type: String })
  @ApiResponse({
    status: 200,
    description: "Featured status toggled successfully",
  })
  @ApiResponse({
    status: 404,
    description: "Project not found",
  })
  async toggleFeatured(@Param("id") id: string) {
    return this.projectsService.toggleFeatured(id);
  }

  @Patch("reorder")
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @ApiOperation({
    summary: "Reorder projects",
    description:
      "Update the display order of multiple projects at once. Requires an array of project IDs with their new order values.",
  })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        projects: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "string" },
              order: { type: "number" },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: "Projects reordered successfully",
  })
  @ApiResponse({
    status: 400,
    description: "Invalid project orders",
  })
  async reorder(@Body() reorderDto: ReorderProjectsDto) {
    return this.projectsService.reorder(reorderDto.projects);
  }
}
