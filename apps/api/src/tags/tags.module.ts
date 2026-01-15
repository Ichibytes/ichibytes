import { Module } from "@nestjs/common";
import { PrismaModule } from "database";
import { TagsService } from "./tags.service";
import { TagsAdminController } from "./tags-admin.controller";

@Module({
  imports: [PrismaModule],
  controllers: [TagsAdminController],
  providers: [TagsService],
  exports: [TagsService],
})
export class TagsModule {}
