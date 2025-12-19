import { FastifyReply, FastifyRequest } from "fastify";
import {
  generateServiceOpenApiSpec,
  listAvailableServices,
} from "@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit";
import type { GetServiceOpenApiSpecHttpRequest } from "@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit";
import { NotFoundException } from "@scaleits-solutions-gmbh/org-lib-backend-common-kit/frameworks/fastify";

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

export function createGetServiceOpenApiSpecHandler() {
  return async (
    request: FastifyRequest<{
      Params: GetServiceOpenApiSpecHttpRequest["pathParams"];
    }>,
    reply: FastifyReply,
  ) => {
    const { serviceId } = request.params;

    // Validate serviceId exists
    const availableServices = listAvailableServices().map((s) => s.id);
    if (!availableServices.includes(serviceId)) {
      throw new NotFoundException({
        message: `Service '${serviceId}' not found`,
        errorCode: "SWAGGER_SERVICE_NOT_FOUND",
        errorItems: [
          {
            item: "availableServices",
            message: availableServices.join(", "),
          },
        ],
      });
    }

    const serverUrl = getServerUrl(request);
    const spec = generateServiceOpenApiSpec(serviceId, { serverUrl });

    if (!spec) {
      throw new NotFoundException({
        message: `Could not generate OpenAPI spec for service '${serviceId}'`,
        errorCode: "SWAGGER_SPEC_NOT_FOUND",
      });
    }

    return reply.status(200).type("application/json").send(spec);
  };
}
