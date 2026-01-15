import {
  Injectable,
  NotFoundException,
  BadRequestException,
  PreconditionFailedException,
} from "@nestjs/common";
import { PrismaService } from "database";
import { Prisma } from "@prisma/client";

export interface CreateRevisionData {
  postId: string;
  content: string;
  excerpt: string | null;
}

export interface RestoreRevisionData {
  postId: string;
  revisionId: string;
  expectedUpdatedAt?: string; // For optimistic concurrency
}

@Injectable()
export class PostRevisionService {
  constructor(private readonly prisma: PrismaService) {}

  async createRevision(data: CreateRevisionData) {
    const post = await this.prisma.post.findUnique({
      where: { id: data.postId },
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${data.postId} not found`);
    }

    const latestRevision = await this.prisma.postRevision.findFirst({
      where: { postId: data.postId },
      orderBy: { version: "desc" },
    });

    const nextVersion = latestRevision ? latestRevision.version + 1 : 1;

    const revision = await this.prisma.postRevision.create({
      data: {
        postId: data.postId,
        content: data.content,
        excerpt: data.excerpt,
        version: nextVersion,
      },
    });

    return this.mapRevisionToResponse(revision);
  }

  async createRevisionIfContentChanged(
    postId: string,
    oldContent: string,
    oldExcerpt: string | null,
    newContent: string,
    newExcerpt: string | null
  ) {
    if (oldContent !== newContent || oldExcerpt !== newExcerpt) {
      return this.createRevision({
        postId,
        content: newContent,
        excerpt: newExcerpt,
      });
    }
    return null;
  }

  async getRevisions(postId: string) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${postId} not found`);
    }

    const revisions = await this.prisma.postRevision.findMany({
      where: { postId },
      orderBy: { version: "desc" },
    });

    return revisions.map((revision) => this.mapRevisionToResponse(revision));
  }

  async getRevision(revisionId: string) {
    const revision = await this.prisma.postRevision.findUnique({
      where: { id: revisionId },
      include: {
        post: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
    });

    if (!revision) {
      throw new NotFoundException(`Revision with ID ${revisionId} not found`);
    }

    return {
      ...this.mapRevisionToResponse(revision),
      post: {
        id: revision.post.id,
        title: revision.post.title,
        slug: revision.post.slug,
      },
    };
  }

  async getRevisionByVersion(postId: string, version: number) {
    const revision = await this.prisma.postRevision.findUnique({
      where: {
        postId_version: {
          postId,
          version,
        },
      },
      include: {
        post: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
    });

    if (!revision) {
      throw new NotFoundException(
        `Revision version ${version} not found for post ${postId}`
      );
    }

    return {
      ...this.mapRevisionToResponse(revision),
      post: {
        id: revision.post.id,
        title: revision.post.title,
        slug: revision.post.slug,
      },
    };
  }

  async getLatestRevision(postId: string) {
    const revision = await this.prisma.postRevision.findFirst({
      where: { postId },
      orderBy: { version: "desc" },
      include: {
        post: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
    });

    if (!revision) {
      throw new NotFoundException(`No revisions found for post ${postId}`);
    }

    return {
      ...this.mapRevisionToResponse(revision),
      post: {
        id: revision.post.id,
        title: revision.post.title,
        slug: revision.post.slug,
      },
    };
  }

  async restoreRevision(data: RestoreRevisionData) {
    const revision = await this.prisma.postRevision.findUnique({
      where: { id: data.revisionId },
      include: {
        post: true,
      },
    });

    if (!revision) {
      throw new NotFoundException(
        `Revision with ID ${data.revisionId} not found`
      );
    }

    if (revision.postId !== data.postId) {
      throw new BadRequestException(
        "Revision does not belong to the specified post"
      );
    }

    const post = revision.post;

    if (data.expectedUpdatedAt) {
      const expectedDate = new Date(data.expectedUpdatedAt);
      const actualDate = new Date(post.updatedAt);

      if (actualDate.getTime() !== expectedDate.getTime()) {
        throw new PreconditionFailedException(
          "Post has been modified since you last viewed it. Please refresh and try again."
        );
      }
    }

    const updatedPost = await this.prisma.post.update({
      where: { id: data.postId },
      data: {
        content: revision.content,
        excerpt: revision.excerpt,
      },
    });

    await this.createRevision({
      postId: data.postId,
      content: updatedPost.content,
      excerpt: updatedPost.excerpt,
    });

    return {
      post: {
        id: updatedPost.id,
        title: updatedPost.title,
        slug: updatedPost.slug,
        content: updatedPost.content,
        excerpt: updatedPost.excerpt,
        updatedAt: updatedPost.updatedAt.toISOString(),
      },
      restoredFrom: {
        revisionId: revision.id,
        version: revision.version,
        createdAt: revision.createdAt.toISOString(),
      },
    };
  }

  async deleteRevision(revisionId: string) {
    const revision = await this.prisma.postRevision.findUnique({
      where: { id: revisionId },
    });

    if (!revision) {
      throw new NotFoundException(`Revision with ID ${revisionId} not found`);
    }

    await this.prisma.postRevision.delete({
      where: { id: revisionId },
    });

    return { success: true };
  }

  async getRevisionCount(postId: string): Promise<number> {
    return this.prisma.postRevision.count({
      where: { postId },
    });
  }

  async getRevisionHistory(postId: string) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
      select: {
        id: true,
        title: true,
        slug: true,
        content: true,
        excerpt: true,
        updatedAt: true,
      },
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${postId} not found`);
    }

    const revisions = await this.prisma.postRevision.findMany({
      where: { postId },
      orderBy: { version: "desc" },
    });

    return {
      post: {
        id: post.id,
        title: post.title,
        slug: post.slug,
        currentContent: post.content,
        currentExcerpt: post.excerpt,
        updatedAt: post.updatedAt.toISOString(),
      },
      revisions: revisions.map((revision) =>
        this.mapRevisionToResponse(revision)
      ),
      totalRevisions: revisions.length,
    };
  }

  private mapRevisionToResponse(revision: any) {
    return {
      id: revision.id,
      postId: revision.postId,
      content: revision.content,
      excerpt: revision.excerpt,
      version: revision.version,
      createdAt: revision.createdAt.toISOString(),
    };
  }
}
