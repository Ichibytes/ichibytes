import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export interface UploadFileOptions {
  key: string;
  body: Buffer | Uint8Array | string;
  contentType: string;
  metadata?: Record<string, string>;
}

export interface SignedUrlOptions {
  key: string;
  expiresIn?: number; // seconds, default 3600 (1 hour)
}

@Injectable()
export class S3StorageService {
  private readonly logger = new Logger(S3StorageService.name);
  private readonly s3Client: S3Client;
  private readonly bucket: string;
  private readonly region: string;
  private readonly baseUrl?: string;

  constructor(private readonly configService: ConfigService) {
    const accessKeyId = this.configService.get<string>("S3_ACCESS_KEY_ID");
    const secretAccessKey = this.configService.get<string>(
      "S3_SECRET_ACCESS_KEY"
    );
    const endpoint = this.configService.get<string>("S3_ENDPOINT");
    this.bucket =
      this.configService.get<string>("S3_BUCKET") || "ichibytes-media";
    this.region = this.configService.get<string>("S3_REGION") || "us-east-1";
    this.baseUrl = this.configService.get<string>("S3_BASE_URL");

    if (!accessKeyId || !secretAccessKey) {
      this.logger.warn(
        "S3 credentials not configured. File uploads will not work."
      );
    }

    const s3Config: any = {
      region: this.region,
      credentials:
        accessKeyId && secretAccessKey
          ? {
              accessKeyId,
              secretAccessKey,
            }
          : undefined,
    };

    if (endpoint) {
      s3Config.endpoint = endpoint;
      s3Config.forcePathStyle = true; // Required for S3-compatible services like MinIO
    }

    this.s3Client = new S3Client(s3Config);
  }

  async uploadFile(options: UploadFileOptions): Promise<string> {
    const { key, body, contentType, metadata } = options;

    try {
      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: body,
        ContentType: contentType,
        Metadata: metadata,
      });

      await this.s3Client.send(command);

      const url = this.getFileUrl(key);
      this.logger.log(`File uploaded successfully: ${key}`);
      return url;
    } catch (error) {
      this.logger.error(`Failed to upload file ${key}:`, error);
      throw error;
    }
  }

  async getFileUrl(key: string): Promise<string> {
    if (this.baseUrl) {
      return `${this.baseUrl}/${key}`;
    }

    return `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`;
  }

  async generateSignedUploadUrl(
    options: SignedUrlOptions
  ): Promise<{ url: string; key: string }> {
    const { key, expiresIn = 3600 } = options;

    try {
      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });

      const url = await getSignedUrl(this.s3Client, command, {
        expiresIn,
      });

      this.logger.log(`Generated signed upload URL for ${key}`);
      return { url, key };
    } catch (error) {
      this.logger.error(
        `Failed to generate signed upload URL for ${key}:`,
        error
      );
      throw error;
    }
  }

  async generateSignedDownloadUrl(options: SignedUrlOptions): Promise<string> {
    const { key, expiresIn = 3600 } = options;

    try {
      const command = new GetObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });

      const url = await getSignedUrl(this.s3Client, command, {
        expiresIn,
      });

      this.logger.log(`Generated signed download URL for ${key}`);
      return url;
    } catch (error) {
      this.logger.error(
        `Failed to generate signed download URL for ${key}:`,
        error
      );
      throw error;
    }
  }

  async deleteFile(key: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });

      await this.s3Client.send(command);
      this.logger.log(`File deleted successfully: ${key}`);
    } catch (error) {
      this.logger.error(`Failed to delete file ${key}:`, error);
      throw error;
    }
  }

  async fileExists(key: string): Promise<boolean> {
    try {
      const command = new HeadObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });

      await this.s3Client.send(command);
      return true;
    } catch (error: any) {
      if (
        error.name === "NotFound" ||
        error.$metadata?.httpStatusCode === 404
      ) {
        return false;
      }
      throw error;
    }
  }

  generateKey(filename: string, prefix = "media"): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    const sanitizedFilename = filename
      .replace(/[^a-zA-Z0-9.-]/g, "_")
      .toLowerCase();
    return `${prefix}/${timestamp}-${random}-${sanitizedFilename}`;
  }
}
