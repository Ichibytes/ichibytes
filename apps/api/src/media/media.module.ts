import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "database";
import { MediaService } from "./media.service";
import { MediaController } from "./media.controller";
import { S3StorageService } from "./storage/s3-storage.service";
import { ImageOptimizationService } from "./storage/image-optimization.service";

@Module({
  imports: [PrismaModule, ConfigModule],
  controllers: [MediaController],
  providers: [MediaService, S3StorageService, ImageOptimizationService],
  exports: [MediaService],
})
export class MediaModule {}
