import { validateApiEnv } from "./schemas/api.schema";
import { validateWebEnv } from "./schemas/web.schema";
import { validateAdminEnv } from "./schemas/admin.schema";

describe("Config Validation", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    // Reset environment before each test
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    // Restore original environment
    process.env = originalEnv;
  });

  describe("API Config", () => {
    it("should validate with all required fields", () => {
      process.env = {
        NODE_ENV: "test",
        DATABASE_URL: "postgresql://user:pass@localhost:5432/db",
        JWT_SECRET: "a".repeat(32),
      };

      const config = validateApiEnv();

      expect(config.NODE_ENV).toBe("test");
      expect(config.PORT).toBe(3000); // default
      expect(config.DATABASE_URL).toBe(
        "postgresql://user:pass@localhost:5432/db"
      );
      expect(config.JWT_SECRET).toBe("a".repeat(32));
    });

    it("should throw error when JWT_SECRET is too short", () => {
      process.env = {
        NODE_ENV: "test",
        DATABASE_URL: "postgresql://user:pass@localhost:5432/db",
        JWT_SECRET: "short",
      };

      expect(() => validateApiEnv()).toThrow(
        "Invalid API environment configuration"
      );
    });

    it("should throw error when DATABASE_URL is missing", () => {
      process.env = {
        NODE_ENV: "test",
        JWT_SECRET: "a".repeat(32),
      };

      expect(() => validateApiEnv()).toThrow(
        "Invalid API environment configuration"
      );
    });

    it("should use default values for optional fields", () => {
      process.env = {
        NODE_ENV: "development",
        DATABASE_URL: "postgresql://user:pass@localhost:5432/db",
        JWT_SECRET: "a".repeat(32),
      };

      const config = validateApiEnv();

      expect(config.PORT).toBe(3000);
      expect(config.HOST).toBe("0.0.0.0");
      expect(config.JWT_EXPIRES_IN).toBe("15m");
      expect(config.JWT_REFRESH_EXPIRES_IN).toBe("7d");
      expect(config.S3_BUCKET).toBe("ichibytes-media");
      expect(config.S3_REGION).toBe("us-east-1");
    });
  });

  describe("Web Config", () => {
    it("should validate with defaults", () => {
      process.env = {
        NODE_ENV: "development",
      };

      const config = validateWebEnv();

      expect(config.NODE_ENV).toBe("development");
      expect(config.NEXT_PUBLIC_API_URL).toBe("http://localhost:3000/api/v1");
      expect(config.NEXT_PUBLIC_SITE_URL).toBe("http://localhost:3001");
      expect(config.NEXT_PUBLIC_ENABLE_COMMENTS).toBe(false);
    });

    it("should transform boolean feature flags", () => {
      process.env = {
        NODE_ENV: "production",
        NEXT_PUBLIC_API_URL: "https://api.ichibytes.dev/api/v1",
        NEXT_PUBLIC_SITE_URL: "https://ichibytes.dev",
        NEXT_PUBLIC_ENABLE_COMMENTS: "true",
        NEXT_PUBLIC_ENABLE_NEWSLETTER: "true",
      };

      const config = validateWebEnv();

      expect(config.NEXT_PUBLIC_ENABLE_COMMENTS).toBe(true);
      expect(config.NEXT_PUBLIC_ENABLE_NEWSLETTER).toBe(true);
    });
  });

  describe("Admin Config", () => {
    it("should validate with defaults", () => {
      process.env = {
        NODE_ENV: "development",
      };

      const config = validateAdminEnv();

      expect(config.NODE_ENV).toBe("development");
      expect(config.VITE_API_URL).toBe("http://localhost:3000/api/v1");
      expect(config.VITE_ENABLE_DEBUG).toBe(false);
    });

    it("should transform debug flag", () => {
      process.env = {
        NODE_ENV: "development",
        VITE_API_URL: "http://localhost:3000/api/v1",
        VITE_ENABLE_DEBUG: "true",
      };

      const config = validateAdminEnv();

      expect(config.VITE_ENABLE_DEBUG).toBe(true);
    });
  });
});
