import { Module } from "@nestjs/common";
import { PrismaModule } from "database";
import { AuditLogService } from "./audit-log.service";
import { AuditLogController } from "./audit-log.controller";

@Module({
  imports: [PrismaModule],
  controllers: [AuditLogController],
  providers: [AuditLogService],
  exports: [AuditLogService],
})
export class AuditLogModule {}
