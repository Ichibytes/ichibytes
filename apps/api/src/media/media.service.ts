import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "database";
import { Prisma } from "@prisma/client";
import { CreateMediaDto } from "./dto/create-media.dto";
import { MediaQueryDto } from "./dto/media-query.dto";
import {
  PaginatedResponseDto,
  PaginationMetaDto,
} from "../core/dto/pagination.dto";
import { S3StorageService } from "./storage/s3-storage.service";
import { ImageOptimizationService } from "./storage/image-optimization.service";

export interface MulterFile {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
  size: number;
  fieldname: string;
  encoding: string;
  destination?: string;
  filename?: string;
  path?: string;
}

export interface UploadFileResult {
  id: string;
  filename: string;
  url: string;
  mimeType: string;
  size: number;
  uploadedBy: {
    id: string;
    email: string;
    name: string | null;
  };
  createdAt: string;
}

@Injectable()
export class MediaService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly s3Storage: S3StorageService,
    private readonly imageOptimization: ImageOptimizationService
  ) {}

  async uploadFile(
    file: MulterFile,
    uploadedBy: string
  ): Promise<UploadFileResult> {
    this.validateFileType(file.mimetype, file.size);

    let fileBuffer = file.buffer;
    let mimeType = file.mimetype;
    let filename = file.originalname;

    if (this.imageOptimization.isImage(file.mimetype)) {
      const format = this.imageOptimization.getOptimizedFormat(file.mimetype);
      const optimized = await this.imageOptimization.optimizeImage({
        buffer: file.buffer,
        format,
      });

      fileBuffer = optimized.buffer;
      mimeType = `image/${format}`;
      filename = filename.replace(/\.[^.]+$/, `.${format}`);
    }

    const key = this.s3Storage.generateKey(filename);
    const url = await this.s3Storage.uploadFile({
      key,
      body: fileBuffer,
      contentType: mimeType,
      metadata: {
        originalFilename: file.originalname,
        uploadedBy,
      },
    });

    const media = await this.prisma.media.create({
      data: {
        filename: file.originalname,
        url,
        mimeType,
        size: fileBuffer.length,
        uploadedBy,
      },
      include: {
        uploader: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    return this.mapMediaToResponse(media);
  }

  async generateSignedUploadUrl(
    filename: string,
    contentType: string,
    uploadedBy: string
  ): Promise<{ url: string; key: string; expiresIn: number }> {
    this.validateMimeType(contentType);

    const key = this.s3Storage.generateKey(filename);
    const { url } = await this.s3Storage.generateSignedUploadUrl({
      key,
      expiresIn: 3600,
    });

    return {
      url,
      key,
      expiresIn: 3600,
    };
  }

  async confirmUpload(
    key: string,
    filename: string,
    mimeType: string,
    size: number,
    uploadedBy: string
  ): Promise<UploadFileResult> {
    const exists = await this.s3Storage.fileExists(key);
    if (!exists) {
      throw new BadRequestException("File not found in storage");
    }

    const url = await this.s3Storage.getFileUrl(key);

    const media = await this.prisma.media.create({
      data: {
        filename,
        url,
        mimeType,
        size,
        uploadedBy,
      },
      include: {
        uploader: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    return this.mapMediaToResponse(media);
  }

  async create(createMediaDto: CreateMediaDto, uploadedBy: string) {
    this.validateFile(createMediaDto);

    const media = await this.prisma.media.create({
      data: {
        filename: createMediaDto.filename,
        url: createMediaDto.url,
        mimeType: createMediaDto.mimeType,
        size: createMediaDto.size,
        uploadedBy,
      },
      include: {
        uploader: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    return this.mapMediaToResponse(media);
  }

  async findAll(query: MediaQueryDto) {
    const { page = 1, limit = 20, ...filters } = query;
    const skip = (page - 1) * limit;

    const where = this.buildWhereClause(filters);

    const [media, total] = await Promise.all([
      this.prisma.media.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          uploader: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
        },
      }),
      this.prisma.media.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: media.map((item) => this.mapMediaToResponse(item)),
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
    const media = await this.prisma.media.findUnique({
      where: { id },
      include: {
        uploader: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    if (!media) {
      throw new NotFoundException(`Media with ID ${id} not found`);
    }

    return this.mapMediaToResponse(media);
  }

  async findByUrl(url: string) {
    const media = await this.prisma.media.findFirst({
      where: { url },
      include: {
        uploader: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    if (!media) {
      throw new NotFoundException(`Media with URL ${url} not found`);
    }

    return this.mapMediaToResponse(media);
  }

  async remove(id: string) {
    const media = await this.prisma.media.findUnique({
      where: { id },
    });

    if (!media) {
      throw new NotFoundException(`Media with ID ${id} not found`);
    }

    try {
      const key = this.extractKeyFromUrl(media.url);
      if (key) {
        await this.s3Storage.deleteFile(key);
      }
    } catch (error) {
      console.error(`Failed to delete file from S3: ${error}`);
    }

    await this.prisma.media.delete({
      where: { id },
    });

    return { success: true };
  }

  async findByUploader(uploadedBy: string, query: MediaQueryDto) {
    const { page = 1, limit = 20, ...filters } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.MediaWhereInput = {
      uploadedBy,
      ...this.buildWhereClause(filters),
    };

    const [media, total] = await Promise.all([
      this.prisma.media.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          uploader: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
        },
      }),
      this.prisma.media.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: media.map((item) => this.mapMediaToResponse(item)),
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

  async getMediaStats() {
    const [total, byMimeType, totalSize] = await Promise.all([
      this.prisma.media.count(),
      this.prisma.media.groupBy({
        by: ["mimeType"],
        _count: {
          id: true,
        },
      }),
      this.prisma.media.aggregate({
        _sum: {
          size: true,
        },
      }),
    ]);

    return {
      total,
      totalSize: totalSize._sum.size || 0,
      byMimeType: byMimeType.map((item) => ({
        mimeType: item.mimeType,
        count: item._count.id,
      })),
    };
  }

  private validateFile(createMediaDto: CreateMediaDto) {
    this.validateMimeType(createMediaDto.mimeType);
    this.validateFileSize(createMediaDto.size);
  }

  private validateFileType(mimeType: string, size: number) {
    this.validateMimeType(mimeType);
    this.validateFileSize(size);
  }

  private validateMimeType(mimeType: string) {
    const allowedMimeTypes = [
      // Images
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/svg+xml",
      // Documents
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      // Archives
      "application/zip",
      "application/x-zip-compressed",
    ];

    if (!allowedMimeTypes.includes(mimeType)) {
      throw new BadRequestException(`MIME type ${mimeType} is not allowed`);
    }
  }

  private validateFileSize(size: number) {
    const maxSize = 100 * 1024 * 1024; // 100 MB
    if (size > maxSize) {
      throw new BadRequestException(
        `File size exceeds maximum allowed size of ${maxSize} bytes`
      );
    }
  }

  private buildWhereClause(
    filters: Omit<MediaQueryDto, "page" | "limit">
  ): Prisma.MediaWhereInput {
    const where: Prisma.MediaWhereInput = {};

    if (filters.mimeType) {
      where.mimeType = filters.mimeType;
    }

    if (filters.uploadedBy) {
      where.uploadedBy = filters.uploadedBy;
    }

    if (filters.search) {
      where.filename = {
        contains: filters.search,
        mode: "insensitive",
      };
    }

    return where;
  }

  private extractKeyFromUrl(url: string): string | null {
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      if (pathname.startsWith("/")) {
        return pathname.substring(1);
      }
      return pathname;
    } catch {
      const parts = url.split("/");
      if (parts.length > 1) {
        return parts.slice(1).join("/");
      }
      return null;
    }
  }

  private mapMediaToResponse(media: any): UploadFileResult {
    return {
      id: media.id,
      filename: media.filename,
      url: media.url,
      mimeType: media.mimeType,
      size: media.size,
      uploadedBy: {
        id: media.uploader.id,
        email: media.uploader.email,
        name: media.uploader.name,
      },
      createdAt: media.createdAt.toISOString(),
    };
  }
}
