import { Module } from "@nestjs/common";
import { PrismaModule } from "database";
import { ProjectsService } from "./projects.service";

@Module({
  imports: [PrismaModule],
  providers: [ProjectsService],
  exports: [ProjectsService],
})
export class ProjectsModule {}
