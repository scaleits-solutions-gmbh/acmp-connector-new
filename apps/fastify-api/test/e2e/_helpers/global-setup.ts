import type { GlobalSetupContext } from "vitest/node";
import { startTestServer, stopTestServer } from "./test-server";

/**
 * Starts the Fastify API once for the entire e2e run.
 *
 * Exposes:
 * - process.env.E2E_BASE_URL
 * - process.env.E2E_API_KEY
 */
export default async function globalSetup(_ctx: GlobalSetupContext) {
  const server = await startTestServer();

  process.env.E2E_BASE_URL = server.baseUrl;
  process.env.E2E_API_KEY = server.apiKey;

  return async () => {
    await stopTestServer(server);
  };
}
