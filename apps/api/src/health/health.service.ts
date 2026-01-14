import { Injectable } from "@nestjs/common";
import { PrismaService } from "database";

@Injectable()
export class HealthService {
  constructor(private readonly prisma: PrismaService) {}

  check() {
    return {
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }

  async ready() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return {
        status: "ready",
        database: "connected",
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: "not ready",
        database: "disconnected",
        timestamp: new Date().toISOString(),
      };
    }
  }

  live() {
    return {
      status: "alive",
      timestamp: new Date().toISOString(),
    };
  }
}
