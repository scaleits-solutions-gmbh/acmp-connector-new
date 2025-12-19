import { describe, expect, it } from "vitest";
import { createAcmpConnectorClient } from "@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit";
import { getE2eApiKey, getE2eBaseUrl } from "./_helpers/e2e-env";

describe("Jobs routes (e2e)", () => {
  const client = createAcmpConnectorClient({
    baseUrl: getE2eBaseUrl(),
    auth: { type: "api-key", header: "x-api-key", key: getE2eApiKey() },
  });

  it("GET /api/jobs (paginated)", async () => {
    const res = await client.getJobs({
      queryParams: { page: 1, pageSize: 10 },
    });
    expect(res.status).toBe(200);
  });
});
