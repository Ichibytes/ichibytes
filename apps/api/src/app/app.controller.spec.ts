import { Test, TestingModule } from "@nestjs/testing";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

describe("AppController", () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();
  });

  describe("getData", () => {
    it("should return API information with message, version, and endpoints", () => {
      const appController = app.get<AppController>(AppController);
      expect(appController.getData()).toEqual({
        message: "Ichibytes API",
        version: "v1",
        endpoints: {
          public: "/api/v1/public",
          admin: "/api/v1/admin",
          auth: "/api/v1/admin/auth",
          health: "/api/v1/health",
        },
      });
    });
  });
});
