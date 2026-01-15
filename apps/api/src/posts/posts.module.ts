import { Module } from "@nestjs/common";
import { PrismaModule } from "database";
import { PostsService } from "./posts.service";
import { PostsAdminController } from "./posts-admin.controller";
import { PostsPublicController } from "./posts-public.controller";

@Module({
  imports: [PrismaModule],
  controllers: [PostsAdminController, PostsPublicController],
  providers: [PostsService],
  exports: [PostsService],
})
export class PostsModule {}
