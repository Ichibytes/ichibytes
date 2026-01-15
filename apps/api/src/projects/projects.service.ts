import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "database";
import { Prisma } from "@prisma/client";
import { generateSlug, generateUniqueSlug } from "database";
import { CreateProjectDto } from "./dto/create-project.dto";
import { UpdateProjectDto } from "./dto/update-project.dto";
import { ProjectQueryDto } from "./dto/project-query.dto";
import {
  PaginatedResponseDto,
  PaginationMetaDto,
} from "../core/dto/pagination.dto";

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProjectDto: CreateProjectDto) {
    const slug = createProjectDto.slug
      ? await this.ensureUniqueSlug(createProjectDto.slug)
      : await this.generateUniqueSlug(createProjectDto.title);

    const maxOrder = await this.getMaxOrder();
    const order = createProjectDto.order ?? maxOrder + 1;

    const project = await this.prisma.project.create({
      data: {
        title: createProjectDto.title,
        slug,
        description: createProjectDto.description,
        featured: createProjectDto.featured ?? false,
        order,
        techStack: createProjectDto.techStack || [],
        links: (createProjectDto.links || {}) as Prisma.InputJsonValue,
        ...(createProjectDto.tagIds &&
          createProjectDto.tagIds.length > 0 && {
            tags: {
              create: createProjectDto.tagIds.map((tagId) => ({
                tagId,
              })),
            },
          }),
        ...(createProjectDto.imageIds &&
          createProjectDto.imageIds.length > 0 && {
            images: {
              create: createProjectDto.imageIds.map((mediaId, index) => ({
                mediaId,
                order: index,
              })),
            },
          }),
      },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
        images: {
          include: {
            media: true,
          },
          orderBy: {
            order: "asc",
          },
        },
      },
    });

    return this.mapProjectToResponse(project);
  }

  async findAll(query: ProjectQueryDto) {
    const { page = 1, limit = 20, ...filters } = query;
    const skip = (page - 1) * limit;

    const where = this.buildWhereClause(filters);

    const [projects, total] = await Promise.all([
      this.prisma.project.findMany({
        where,
        skip,
        take: limit,
        orderBy: [
          { featured: "desc" },
          { order: "asc" },
          { createdAt: "desc" },
        ],
        include: {
          tags: {
            include: {
              tag: true,
            },
          },
          images: {
            include: {
              media: true,
            },
            orderBy: {
              order: "asc",
            },
          },
        },
      }),
      this.prisma.project.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: projects.map((project) => this.mapProjectToResponse(project)),
      meta: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      } as PaginationMetaDto,
    };
  }

  async findOne(id: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
        images: {
          include: {
            media: true,
          },
          orderBy: {
            order: "asc",
          },
        },
      },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    return this.mapProjectToResponse(project);
  }

  async findBySlug(slug: string) {
    const project = await this.prisma.project.findUnique({
      where: { slug },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
        images: {
          include: {
            media: true,
          },
          orderBy: {
            order: "asc",
          },
        },
      },
    });

    if (!project) {
      throw new NotFoundException(`Project with slug ${slug} not found`);
    }

    return this.mapProjectToResponse(project);
  }

  async update(id: string, updateProjectDto: UpdateProjectDto) {
    const existingProject = await this.prisma.project.findUnique({
      where: { id },
    });

    if (!existingProject) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    let slug = existingProject.slug;
    if (
      updateProjectDto.slug &&
      updateProjectDto.slug !== existingProject.slug
    ) {
      slug = await this.ensureUniqueSlug(updateProjectDto.slug, id);
    } else if (updateProjectDto.title && !updateProjectDto.slug) {
      slug = await this.generateUniqueSlug(updateProjectDto.title, id);
    }

    const updateData: Prisma.ProjectUpdateInput = {
      ...(updateProjectDto.title && { title: updateProjectDto.title }),
      ...(slug && { slug }),
      ...(updateProjectDto.description && {
        description: updateProjectDto.description,
      }),
      ...(updateProjectDto.featured !== undefined && {
        featured: updateProjectDto.featured,
      }),
      ...(updateProjectDto.order !== undefined && {
        order: updateProjectDto.order,
      }),
      ...(updateProjectDto.techStack !== undefined && {
        techStack: updateProjectDto.techStack,
      }),
      ...(updateProjectDto.links !== undefined && {
        links: updateProjectDto.links as Prisma.InputJsonValue,
      }),
    };

    if (updateProjectDto.tagIds !== undefined) {
      await this.prisma.projectTag.deleteMany({
        where: { projectId: id },
      });

      if (updateProjectDto.tagIds.length > 0) {
        updateData.tags = {
          create: updateProjectDto.tagIds.map((tagId) => ({
            tagId,
          })),
        };
      }
    }

    if (updateProjectDto.imageIds !== undefined) {
      await this.prisma.projectImage.deleteMany({
        where: { projectId: id },
      });

      if (updateProjectDto.imageIds.length > 0) {
        updateData.images = {
          create: updateProjectDto.imageIds.map((mediaId, index) => ({
            mediaId,
            order: index,
          })),
        };
      }
    }

    const project = await this.prisma.project.update({
      where: { id },
      data: updateData,
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
        images: {
          include: {
            media: true,
          },
          orderBy: {
            order: "asc",
          },
        },
      },
    });

    return this.mapProjectToResponse(project);
  }

  async remove(id: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    await this.prisma.project.delete({
      where: { id },
    });

    return { success: true };
  }

  async toggleFeatured(id: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    const updatedProject = await this.prisma.project.update({
      where: { id },
      data: {
        featured: !project.featured,
      },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
        images: {
          include: {
            media: true,
          },
          orderBy: {
            order: "asc",
          },
        },
      },
    });

    return this.mapProjectToResponse(updatedProject);
  }

  async setFeatured(id: string, featured: boolean) {
    const project = await this.prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    const updatedProject = await this.prisma.project.update({
      where: { id },
      data: {
        featured,
      },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
        images: {
          include: {
            media: true,
          },
          orderBy: {
            order: "asc",
          },
        },
      },
    });

    return this.mapProjectToResponse(updatedProject);
  }

  async reorder(projectOrders: Array<{ id: string; order: number }>) {
    if (!projectOrders || projectOrders.length === 0) {
      throw new BadRequestException("Project orders array cannot be empty");
    }

    const projectIds = projectOrders.map((po) => po.id);
    const existingProjects = await this.prisma.project.findMany({
      where: {
        id: { in: projectIds },
      },
    });

    if (existingProjects.length !== projectIds.length) {
      throw new BadRequestException("One or more project IDs are invalid");
    }

    await this.prisma.$transaction(
      projectOrders.map(({ id, order }) =>
        this.prisma.project.update({
          where: { id },
          data: { order },
        })
      )
    );

    return { success: true };
  }

  private async generateUniqueSlug(
    title: string,
    excludeId?: string
  ): Promise<string> {
    const baseSlug = generateSlug(title);
    return generateUniqueSlug(baseSlug, async (slug: string) => {
      const existing = await this.prisma.project.findUnique({
        where: { slug },
      });
      return existing !== null && existing.id !== excludeId;
    });
  }

  private async ensureUniqueSlug(
    slug: string,
    excludeId?: string
  ): Promise<string> {
    const normalizedSlug = generateSlug(slug);
    return generateUniqueSlug(normalizedSlug, async (checkSlug: string) => {
      const existing = await this.prisma.project.findUnique({
        where: { slug: checkSlug },
      });
      return existing !== null && existing.id !== excludeId;
    });
  }

  private buildWhereClause(
    filters: Omit<ProjectQueryDto, "page" | "limit">
  ): Prisma.ProjectWhereInput {
    const where: Prisma.ProjectWhereInput = {};

    if (filters.featured !== undefined) {
      where.featured = filters.featured;
    }

    if (filters.tagIds && filters.tagIds.length > 0) {
      where.tags = {
        some: {
          tagId: { in: filters.tagIds },
        },
      };
    }

    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: "insensitive" } },
        { description: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    return where;
  }

  private async getMaxOrder(): Promise<number> {
    const result = await this.prisma.project.findFirst({
      orderBy: { order: "desc" },
      select: { order: true },
    });
    return result?.order ?? -1;
  }

  private mapProjectToResponse(project: any) {
    return {
      id: project.id,
      title: project.title,
      slug: project.slug,
      description: project.description,
      featured: project.featured,
      order: project.order,
      techStack: project.techStack || [],
      links: project.links || {},
      tags:
        project.tags?.map((pt: any) => ({
          id: pt.tag.id,
          name: pt.tag.name,
          slug: pt.tag.slug,
        })) || [],
      images:
        project.images?.map((pi: any) => ({
          id: pi.media.id,
          filename: pi.media.filename,
          url: pi.media.url,
          mimeType: pi.media.mimeType,
          size: pi.media.size,
          order: pi.order,
          alt: pi.alt,
        })) || [],
      createdAt: project.createdAt.toISOString(),
      updatedAt: project.updatedAt.toISOString(),
    };
  }
}
