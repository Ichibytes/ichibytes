import { Module } from "@nestjs/common";
import { PrismaModule } from "database";
import { ProjectsService } from "./projects.service";
import { ProjectsPublicController } from "./projects-public.controller";

@Module({
  imports: [PrismaModule],
  controllers: [ProjectsPublicController],
  providers: [ProjectsService],
  exports: [ProjectsService],
})
export class ProjectsModule {}
