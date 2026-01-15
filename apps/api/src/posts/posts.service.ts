import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "database";
import { Prisma, PostStatus } from "@prisma/client";
import { generateSlug, generateUniqueSlug } from "database";
import { CreatePostDto } from "./dto/create-post.dto";
import { UpdatePostDto } from "./dto/update-post.dto";
import { PostQueryDto } from "./dto/post-query.dto";
import {
  PaginatedResponseDto,
  PaginationMetaDto,
} from "../core/dto/pagination.dto";

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPostDto: CreatePostDto, authorId: string) {
    const slug = createPostDto.slug
      ? await this.ensureUniqueSlug(createPostDto.slug)
      : await this.generateUniqueSlug(createPostDto.title);

    const scheduledAt = createPostDto.scheduledAt
      ? new Date(createPostDto.scheduledAt)
      : null;

    const status =
      createPostDto.status ||
      (scheduledAt && scheduledAt > new Date()
        ? PostStatus.SCHEDULED
        : PostStatus.DRAFT);

    const publishedAt = status === PostStatus.PUBLISHED ? new Date() : null;

    const post = await this.prisma.post.create({
      data: {
        title: createPostDto.title,
        slug,
        content: createPostDto.content,
        excerpt: createPostDto.excerpt,
        status,
        publishedAt,
        scheduledAt,
        authorId,
        ...(createPostDto.tagIds &&
          createPostDto.tagIds.length > 0 && {
            tags: {
              create: createPostDto.tagIds.map((tagId) => ({
                tagId,
              })),
            },
          }),
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    return this.mapPostToResponse(post);
  }

  async findAll(query: PostQueryDto) {
    const { page = 1, limit = 20, ...filters } = query;
    const skip = (page - 1) * limit;

    const where = this.buildWhereClause(filters);

    const [posts, total] = await Promise.all([
      this.prisma.post.findMany({
        where,
        skip,
        take: limit,
        orderBy: this.buildOrderBy(query.sort, query.order),
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          tags: {
            include: {
              tag: true,
            },
          },
        },
      }),
      this.prisma.post.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: posts.map((post) => this.mapPostToResponse(post)),
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
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
        revisions: {
          orderBy: {
            version: "desc",
          },
          take: 10,
        },
      },
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    return this.mapPostToResponse(post);
  }

  async findBySlug(slug: string) {
    const post = await this.prisma.post.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    if (!post) {
      throw new NotFoundException(`Post with slug ${slug} not found`);
    }

    return this.mapPostToResponse(post);
  }

  async update(id: string, updatePostDto: UpdatePostDto, userId: string) {
    const existingPost = await this.prisma.post.findUnique({
      where: { id },
    });

    if (!existingPost) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    let slug = existingPost.slug;
    if (updatePostDto.slug && updatePostDto.slug !== existingPost.slug) {
      slug = await this.ensureUniqueSlug(updatePostDto.slug, id);
    } else if (updatePostDto.title && !updatePostDto.slug) {
      slug = await this.generateUniqueSlug(updatePostDto.title, id);
    }

    const updateData: Prisma.PostUpdateInput = {
      ...(updatePostDto.title && { title: updatePostDto.title }),
      ...(slug && { slug }),
      ...(updatePostDto.content && { content: updatePostDto.content }),
      ...(updatePostDto.excerpt !== undefined && {
        excerpt: updatePostDto.excerpt,
      }),
      ...(updatePostDto.status && { status: updatePostDto.status }),
    };

    if (updatePostDto.scheduledAt) {
      const scheduledAt = new Date(updatePostDto.scheduledAt);
      updateData.scheduledAt = scheduledAt;
      if (
        scheduledAt <= new Date() &&
        updatePostDto.status !== PostStatus.PUBLISHED
      ) {
        updateData.status = PostStatus.SCHEDULED;
      }
    }

    if (
      updatePostDto.status === PostStatus.PUBLISHED &&
      !existingPost.publishedAt
    ) {
      updateData.publishedAt = new Date();
    }

    if (
      updatePostDto.status === PostStatus.ARCHIVED &&
      existingPost.publishedAt
    ) {
      updateData.publishedAt = null;
    }

    if (updatePostDto.tagIds !== undefined) {
      await this.prisma.postTag.deleteMany({
        where: { postId: id },
      });

      if (updatePostDto.tagIds.length > 0) {
        updateData.tags = {
          create: updatePostDto.tagIds.map((tagId) => ({
            tagId,
          })),
        };
      }
    }

    const post = await this.prisma.post.update({
      where: { id },
      data: updateData,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    await this.createRevisionIfContentChanged(existingPost, post);

    return this.mapPostToResponse(post);
  }

  async remove(id: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    await this.prisma.post.delete({
      where: { id },
    });

    return { success: true };
  }

  async publish(id: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    if (post.status === PostStatus.PUBLISHED) {
      throw new BadRequestException("Post is already published");
    }

    const updatedPost = await this.prisma.post.update({
      where: { id },
      data: {
        status: PostStatus.PUBLISHED,
        publishedAt: new Date(),
        scheduledAt: null,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    return this.mapPostToResponse(updatedPost);
  }

  async unpublish(id: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    if (post.status !== PostStatus.PUBLISHED) {
      throw new BadRequestException("Post is not published");
    }

    const updatedPost = await this.prisma.post.update({
      where: { id },
      data: {
        status: PostStatus.DRAFT,
        publishedAt: null,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    return this.mapPostToResponse(updatedPost);
  }

  async archive(id: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    const updatedPost = await this.prisma.post.update({
      where: { id },
      data: {
        status: PostStatus.ARCHIVED,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    return this.mapPostToResponse(updatedPost);
  }

  private async generateUniqueSlug(
    title: string,
    excludeId?: string
  ): Promise<string> {
    const baseSlug = generateSlug(title);
    return generateUniqueSlug(baseSlug, async (slug: string) => {
      const existing = await this.prisma.post.findUnique({
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
      const existing = await this.prisma.post.findUnique({
        where: { slug: checkSlug },
      });
      return existing !== null && existing.id !== excludeId;
    });
  }

  private buildWhereClause(
    filters: Omit<PostQueryDto, "page" | "limit">
  ): Prisma.PostWhereInput {
    const where: Prisma.PostWhereInput = {};

    if (filters.status && filters.status.length > 0) {
      where.status = { in: filters.status };
    }

    if (filters.authorId) {
      where.authorId = filters.authorId;
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
        { content: { contains: filters.search, mode: "insensitive" } },
        { excerpt: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    if (filters.startDate || filters.endDate) {
      where.publishedAt = {};
      if (filters.startDate) {
        where.publishedAt.gte = new Date(filters.startDate);
      }
      if (filters.endDate) {
        where.publishedAt.lte = new Date(filters.endDate);
      }
    }

    return where;
  }

  private buildOrderBy(
    sort?: string,
    order: "asc" | "desc" = "desc"
  ): Prisma.PostOrderByWithRelationInput {
    const sortField = sort || "publishedAt";
    const validSortFields = ["publishedAt", "createdAt", "updatedAt", "title"];

    if (!validSortFields.includes(sortField)) {
      return { publishedAt: order };
    }

    return {
      [sortField]: order,
    } as Prisma.PostOrderByWithRelationInput;
  }

  private async createRevisionIfContentChanged(
    oldPost: { content: string; excerpt: string | null },
    newPost: { id: string; content: string; excerpt: string | null }
  ) {
    if (
      oldPost.content !== newPost.content ||
      oldPost.excerpt !== newPost.excerpt
    ) {
      const latestRevision = await this.prisma.postRevision.findFirst({
        where: { postId: newPost.id },
        orderBy: { version: "desc" },
      });

      const nextVersion = latestRevision ? latestRevision.version + 1 : 1;

      await this.prisma.postRevision.create({
        data: {
          postId: newPost.id,
          content: newPost.content,
          excerpt: newPost.excerpt,
          version: nextVersion,
        },
      });
    }
  }

  private mapPostToResponse(post: any) {
    return {
      id: post.id,
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt,
      status: post.status,
      publishedAt: post.publishedAt?.toISOString() || null,
      scheduledAt: post.scheduledAt?.toISOString() || null,
      author: post.author,
      tags:
        post.tags?.map((pt: any) => ({
          id: pt.tag.id,
          name: pt.tag.name,
          slug: pt.tag.slug,
        })) || [],
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
      ...(post.revisions && {
        revisions: post.revisions.map((rev: any) => ({
          id: rev.id,
          version: rev.version,
          createdAt: rev.createdAt.toISOString(),
        })),
      }),
    };
  }
}
