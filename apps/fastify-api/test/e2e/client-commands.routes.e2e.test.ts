import { describe, expect, it } from "vitest";
import { createAcmpConnectorClient } from "@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit";
import { getE2eApiKey, getE2eBaseUrl } from "./_helpers/e2e-env";

describe("Client commands routes (e2e)", () => {
  const client = createAcmpConnectorClient({
    baseUrl: getE2eBaseUrl(),
    auth: { type: "api-key", header: "x-api-key", key: getE2eApiKey() },
  });

  it("GET /api/client-commands (paginated)", async () => {
    const res = await client.getClientCommands({
      queryParams: { page: 1, pageSize: 10 },
    });
    expect(res.status).toBe(200);
  });

  it("GET /api/client-commands/{id}", async () => {
    const res = await client.getClientCommandById({
      pathParams: { id: "cmd-1" },
    });
    expect(res.status).toBe(200);
    expect(res.data.id).toBeDefined();
  });

  it("POST /api/client-commands/{id}/push", async () => {
    const res = await client.pushClientCommand({
      pathParams: { id: "cmd-1" },
      body: { clientIds: ["client-1"] },
    });

    expect(res.status).toBe(202);
    expect(res.data).toMatchObject({
      success: true,
      jobId: expect.any(String),
    });
  });
});
