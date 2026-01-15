import { Injectable, Logger } from "@nestjs/common";
import sharp from "sharp";

export interface OptimizeImageOptions {
  buffer: Buffer;
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: "jpeg" | "png" | "webp";
}

export interface ImageMetadata {
  width: number;
  height: number;
  format: string;
  size: number;
}

@Injectable()
export class ImageOptimizationService {
  private readonly logger = new Logger(ImageOptimizationService.name);
  private readonly defaultMaxWidth = 1920;
  private readonly defaultMaxHeight = 1080;
  private readonly defaultQuality = 85;

  async optimizeImage(
    options: OptimizeImageOptions
  ): Promise<{ buffer: Buffer; metadata: ImageMetadata }> {
    const {
      buffer,
      maxWidth = this.defaultMaxWidth,
      maxHeight = this.defaultMaxHeight,
      quality = this.defaultQuality,
      format = "webp",
    } = options;

    try {
      const image = sharp(buffer);
      const metadata = await image.metadata();

      let processedImage = image.resize(maxWidth, maxHeight, {
        fit: "inside",
        withoutEnlargement: true,
      });

      switch (format) {
        case "jpeg":
          processedImage = processedImage.jpeg({ quality });
          break;
        case "png":
          processedImage = processedImage.png({
            quality: Math.min(quality, 100),
          });
          break;
        case "webp":
          processedImage = processedImage.webp({ quality });
          break;
      }

      const optimizedBuffer = await processedImage.toBuffer();
      const optimizedSize = optimizedBuffer.length;

      this.logger.log(
        `Image optimized: ${metadata.size} bytes -> ${optimizedSize} bytes (${Math.round((1 - optimizedSize / metadata.size) * 100)}% reduction)`
      );

      return {
        buffer: optimizedBuffer,
        metadata: {
          width: metadata.width || 0,
          height: metadata.height || 0,
          format: format,
          size: optimizedSize,
        },
      };
    } catch (error) {
      this.logger.error("Failed to optimize image:", error);
      throw error;
    }
  }

  async generateThumbnail(
    buffer: Buffer,
    width = 300,
    height = 300
  ): Promise<Buffer> {
    try {
      const thumbnail = await sharp(buffer)
        .resize(width, height, {
          fit: "cover",
          position: "center",
        })
        .webp({ quality: 80 })
        .toBuffer();

      this.logger.log(`Thumbnail generated: ${width}x${height}`);
      return thumbnail;
    } catch (error) {
      this.logger.error("Failed to generate thumbnail:", error);
      throw error;
    }
  }

  async getImageMetadata(buffer: Buffer): Promise<ImageMetadata> {
    try {
      const metadata = await sharp(buffer).metadata();
      return {
        width: metadata.width || 0,
        height: metadata.height || 0,
        format: metadata.format || "unknown",
        size: buffer.length,
      };
    } catch (error) {
      this.logger.error("Failed to get image metadata:", error);
      throw error;
    }
  }

  isImage(mimeType: string): boolean {
    return mimeType.startsWith("image/");
  }

  getOptimizedFormat(mimeType: string): "jpeg" | "png" | "webp" {
    if (mimeType === "image/png") {
      return "png";
    }
    if (mimeType === "image/jpeg" || mimeType === "image/jpg") {
      return "jpeg";
    }
    return "webp";
  }
}
