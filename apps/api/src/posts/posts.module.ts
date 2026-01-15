import { Module } from "@nestjs/common";
import { PrismaModule } from "database";
import { PostsService } from "./posts.service";
import { PostRevisionService } from "./post-revision.service";
import { PostsAdminController } from "./posts-admin.controller";
import { PostsPublicController } from "./posts-public.controller";

@Module({
  imports: [PrismaModule],
  controllers: [PostsAdminController, PostsPublicController],
  providers: [PostsService, PostRevisionService],
  exports: [PostsService, PostRevisionService],
})
export class PostsModule {}
