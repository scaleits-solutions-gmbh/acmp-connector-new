import { describe, expect, it } from "vitest";
import { createAcmpConnectorClient } from "@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit";
import { getE2eApiKey, getE2eBaseUrl } from "./_helpers/e2e-env";

describe("Rollout templates routes (e2e)", () => {
  const client = createAcmpConnectorClient({
    baseUrl: getE2eBaseUrl(),
    auth: { type: "api-key", header: "x-api-key", key: getE2eApiKey() },
  });

  it("GET /api/rollout-templates (paginated)", async () => {
    const res = await client.getRolloutTemplates({
      queryParams: { page: 1, pageSize: 10 },
    });
    expect(res.status).toBe(200);
  });

  it("GET /api/rollout-templates/{id}", async () => {
    const res = await client.getRolloutTemplateById({
      pathParams: { id: "rt-1" },
    });
    expect(res.status).toBe(200);
    expect(res.data.id).toBeDefined();
  });

  it("POST /api/rollout-templates/{id}/push", async () => {
    const res = await client.pushRolloutTemplate({
      pathParams: { id: "rt-1" },
      body: {
        clients: [
          {
            id: "client-1",
            name: "Client 1",
            description: "Test client for e2e rollout push",
          },
        ],
      },
    });

    expect(res.status).toBe(202);
    expect(res.data).toMatchObject({
      success: true,
      jobId: expect.any(String),
    });
  });
});
