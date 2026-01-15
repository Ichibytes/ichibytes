import { Module } from "@nestjs/common";
import { PrismaModule } from "database";
import { TagsService } from "./tags.service";

@Module({
  imports: [PrismaModule],
  providers: [TagsService],
  exports: [TagsService],
})
export class TagsModule {}
