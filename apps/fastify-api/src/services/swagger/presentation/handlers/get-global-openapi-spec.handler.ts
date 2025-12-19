import { FastifyReply, FastifyRequest } from "fastify";
import { generateGlobalOpenApiSpec } from "@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit";
import type { GetGlobalOpenApiSpecHttpRequest } from "@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit";

/**
 * Extract server URL from request headers.
 * Supports x-forwarded-proto/x-forwarded-host for proxies.
 */
function getServerUrl(request: FastifyRequest): string {
  const protocol =
    (request.headers["x-forwarded-proto"] as string)?.split(",")[0]?.trim() ||
    (request.protocol === "https" ? "https" : "http");
  const host =
    (request.headers["x-forwarded-host"] as string)?.split(",")[0]?.trim() ||
    request.headers.host ||
    "localhost:3000";

  return `${protocol}://${host}`;
}

export function createGetGlobalOpenApiSpecHandler() {
  return async (
    request: FastifyRequest<{ Querystring: GetGlobalOpenApiSpecHttpRequest }>,
    reply: FastifyReply,
  ) => {
    const serverUrl = getServerUrl(request);
    const spec = generateGlobalOpenApiSpec({ serverUrl });

    return reply.status(200).type("application/json").send(spec);
  };
}
