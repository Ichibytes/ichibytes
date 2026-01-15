import { Module } from "@nestjs/common";
import { PrismaModule } from "database";
import { ProjectsService } from "./projects.service";
import { ProjectsPublicController } from "./projects-public.controller";
import { ProjectsAdminController } from "./projects-admin.controller";

@Module({
  imports: [PrismaModule],
  controllers: [ProjectsPublicController, ProjectsAdminController],
  providers: [ProjectsService],
  exports: [ProjectsService],
})
export class ProjectsModule {}
