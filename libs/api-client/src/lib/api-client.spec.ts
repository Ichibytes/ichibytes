import { ApiClient, createApiClient } from "./api-client";

describe("ApiClient", () => {
  describe("createApiClient", () => {
    it("should create an ApiClient instance", () => {
      const client = createApiClient({
        baseURL: "https://api.example.com",
      });
      expect(client).toBeInstanceOf(ApiClient);
    });
  });

  describe("ApiClient", () => {
    let client: ApiClient;

    beforeEach(() => {
      client = new ApiClient({
        baseURL: "https://api.example.com",
      });
    });

    it("should be instantiable", () => {
      expect(client).toBeInstanceOf(ApiClient);
    });

    it("should allow setting and clearing tokens", () => {
      client.setToken("test-token");
      client.setRefreshToken("test-refresh-token");
      expect(client).toBeInstanceOf(ApiClient);

      client.clearTokens();
      expect(client).toBeInstanceOf(ApiClient);
    });
  });
});
