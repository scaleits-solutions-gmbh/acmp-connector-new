import { describe, expect, it } from "vitest";
import { createAcmpConnectorClient } from "@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit";
import { getE2eApiKey, getE2eBaseUrl } from "./_helpers/e2e-env";

describe("Assets routes (e2e)", () => {
  const client = createAcmpConnectorClient({
    baseUrl: getE2eBaseUrl(),
    auth: { type: "api-key", header: "x-api-key", key: getE2eApiKey() },
  });

  it("GET /api/assets (paginated)", async () => {
    const res = await client.getAssets({
      queryParams: { page: 1, pageSize: 10 },
    });
    expect(res.status).toBe(200);
  });

  it("GET /api/assets/{id}", async () => {
    const res = await client.getAssetById({ pathParams: { id: "asset-1" } });
    expect(res.status).toBe(200);
    expect(res.data.id).toBeDefined();
  });

  it("GET /api/assets/types", async () => {
    const res = await client.getAssetTypes({});
    expect(res.status).toBe(200);
    expect(Array.isArray(res.data)).toBe(true);
  });
});
