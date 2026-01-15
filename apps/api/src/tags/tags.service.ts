import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from "@nestjs/common";
import { PrismaService } from "database";
import { Prisma } from "@prisma/client";
import { generateSlug, generateUniqueSlug } from "database";
import { CreateTagDto } from "./dto/create-tag.dto";
import { UpdateTagDto } from "./dto/update-tag.dto";
import { TagQueryDto } from "./dto/tag-query.dto";
import {
  PaginatedResponseDto,
  PaginationMetaDto,
} from "../core/dto/pagination.dto";

@Injectable()
export class TagsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTagDto: CreateTagDto) {
    const slug = createTagDto.slug
      ? await this.ensureUniqueSlug(createTagDto.slug)
      : await this.generateUniqueSlug(createTagDto.name);

    try {
      const tag = await this.prisma.tag.create({
        data: {
          name: createTagDto.name,
          slug,
        },
        include: {
          _count: {
            select: {
              posts: true,
              projects: true,
            },
          },
        },
      });

      return this.mapTagToResponse(tag);
    } catch (error: any) {
      if (error.code === "P2002") {
        throw new ConflictException(
          `Tag with name "${createTagDto.name}" or slug "${slug}" already exists`
        );
      }
      throw error;
    }
  }

  async findAll(query: TagQueryDto) {
    const { page = 1, limit = 20, ...filters } = query;
    const skip = (page - 1) * limit;

    const where = this.buildWhereClause(filters);

    const [tags, total] = await Promise.all([
      this.prisma.tag.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ createdAt: "desc" }],
        include: {
          _count: {
            select: {
              posts: true,
              projects: true,
            },
          },
        },
      }),
      this.prisma.tag.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: tags.map((tag) => this.mapTagToResponse(tag)),
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
    const tag = await this.prisma.tag.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            posts: true,
            projects: true,
          },
        },
      },
    });

    if (!tag) {
      throw new NotFoundException(`Tag with ID ${id} not found`);
    }

    return this.mapTagToResponse(tag);
  }

  async findBySlug(slug: string) {
    const tag = await this.prisma.tag.findUnique({
      where: { slug },
      include: {
        _count: {
          select: {
            posts: true,
            projects: true,
          },
        },
      },
    });

    if (!tag) {
      throw new NotFoundException(`Tag with slug ${slug} not found`);
    }

    return this.mapTagToResponse(tag);
  }

  async update(id: string, updateTagDto: UpdateTagDto) {
    const existingTag = await this.prisma.tag.findUnique({
      where: { id },
    });

    if (!existingTag) {
      throw new NotFoundException(`Tag with ID ${id} not found`);
    }

    let slug = existingTag.slug;
    if (updateTagDto.slug && updateTagDto.slug !== existingTag.slug) {
      slug = await this.ensureUniqueSlug(updateTagDto.slug, id);
    } else if (updateTagDto.name && !updateTagDto.slug) {
      slug = await this.generateUniqueSlug(updateTagDto.name, id);
    }

    try {
      const tag = await this.prisma.tag.update({
        where: { id },
        data: {
          ...(updateTagDto.name && { name: updateTagDto.name }),
          ...(slug && { slug }),
        },
        include: {
          _count: {
            select: {
              posts: true,
              projects: true,
            },
          },
        },
      });

      return this.mapTagToResponse(tag);
    } catch (error: any) {
      if (error.code === "P2002") {
        throw new ConflictException(
          `Tag with name "${updateTagDto.name}" or slug "${slug}" already exists`
        );
      }
      throw error;
    }
  }

  async remove(id: string) {
    const tag = await this.prisma.tag.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            posts: true,
            projects: true,
          },
        },
      },
    });

    if (!tag) {
      throw new NotFoundException(`Tag with ID ${id} not found`);
    }

    const usageCount = tag._count.posts + tag._count.projects;
    if (usageCount > 0) {
      throw new BadRequestException(
        `Cannot delete tag "${tag.name}" because it is used in ${usageCount} post(s) or project(s). Remove associations first.`
      );
    }

    await this.prisma.tag.delete({
      where: { id },
    });

    return { success: true };
  }

  async search(query: string, limit = 10) {
    if (!query || query.trim().length === 0) {
      return [];
    }

    const tags = await this.prisma.tag.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { slug: { contains: query, mode: "insensitive" } },
        ],
      },
      take: limit,
      orderBy: [
        {
          posts: {
            _count: "desc",
          },
        },
        {
          projects: {
            _count: "desc",
          },
        },
      ],
      include: {
        _count: {
          select: {
            posts: true,
            projects: true,
          },
        },
      },
    });

    return tags.map((tag) => this.mapTagToResponse(tag));
  }

  async autocomplete(query: string, limit = 10) {
    if (!query || query.trim().length === 0) {
      return [];
    }

    const tags = await this.prisma.tag.findMany({
      where: {
        OR: [
          { name: { startsWith: query, mode: "insensitive" } },
          { slug: { startsWith: query, mode: "insensitive" } },
        ],
      },
      take: limit,
      orderBy: [
        {
          posts: {
            _count: "desc",
          },
        },
        {
          projects: {
            _count: "desc",
          },
        },
      ],
      select: {
        id: true,
        name: true,
        slug: true,
      },
    });

    return tags;
  }

  async getUsageStats(id: string) {
    const tag = await this.prisma.tag.findUnique({
      where: { id },
      include: {
        posts: {
          select: {
            post: {
              select: {
                id: true,
                title: true,
                status: true,
              },
            },
          },
        },
        projects: {
          select: {
            project: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
        _count: {
          select: {
            posts: true,
            projects: true,
          },
        },
      },
    });

    if (!tag) {
      throw new NotFoundException(`Tag with ID ${id} not found`);
    }

    return {
      id: tag.id,
      name: tag.name,
      slug: tag.slug,
      usageCount: tag._count.posts + tag._count.projects,
      postsCount: tag._count.posts,
      projectsCount: tag._count.projects,
      posts: tag.posts.map((pt) => ({
        id: pt.post.id,
        title: pt.post.title,
        status: pt.post.status,
      })),
      projects: tag.projects.map((pt) => ({
        id: pt.project.id,
        title: pt.project.title,
      })),
    };
  }

  async getPopularTags(limit = 10) {
    const tags = await this.prisma.tag.findMany({
      take: limit,
      include: {
        _count: {
          select: {
            posts: true,
            projects: true,
          },
        },
      },
      orderBy: [
        {
          posts: {
            _count: "desc",
          },
        },
        {
          projects: {
            _count: "desc",
          },
        },
      ],
    });

    return tags.map((tag) => ({
      id: tag.id,
      name: tag.name,
      slug: tag.slug,
      usageCount: tag._count.posts + tag._count.projects,
      postsCount: tag._count.posts,
      projectsCount: tag._count.projects,
    }));
  }

  private async generateUniqueSlug(
    name: string,
    excludeId?: string
  ): Promise<string> {
    const baseSlug = generateSlug(name);
    return generateUniqueSlug(baseSlug, async (slug: string) => {
      const existing = await this.prisma.tag.findUnique({
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
      const existing = await this.prisma.tag.findUnique({
        where: { slug: checkSlug },
      });
      return existing !== null && existing.id !== excludeId;
    });
  }

  private buildWhereClause(
    filters: Omit<TagQueryDto, "page" | "limit">
  ): Prisma.TagWhereInput {
    const where: Prisma.TagWhereInput = {};

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: "insensitive" } },
        { slug: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    return where;
  }

  private mapTagToResponse(tag: any) {
    return {
      id: tag.id,
      name: tag.name,
      slug: tag.slug,
      usageCount: (tag._count?.posts || 0) + (tag._count?.projects || 0),
      postsCount: tag._count?.posts || 0,
      projectsCount: tag._count?.projects || 0,
      createdAt: tag.createdAt.toISOString(),
      updatedAt: tag.updatedAt.toISOString(),
    };
  }
}
