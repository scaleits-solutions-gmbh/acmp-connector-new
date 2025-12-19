import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import {
  getSwaggerUiHttpMetadata,
  getSwaggerUiHttpRequestSchema,
  getSwaggerServiceUiHttpMetadata,
  getSwaggerServiceUiHttpRequestSchema,
} from "@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit";
import {
  buildFastifySchema,
  toFastifyPath,
} from "@scaleits-solutions-gmbh/org-lib-backend-common-kit/frameworks/fastify";
import {
  createGetSwaggerUiHandler,
  createGetSwaggerServiceUiHandler,
} from "../../handlers";

export async function swaggerUiRoutes(fastify: FastifyInstance) {
  // Global Swagger UI (path is empty string in contract, normalize to '/')
  const globalPath = getSwaggerUiHttpMetadata.path || "/";
  fastify.withTypeProvider<ZodTypeProvider>().route({
    method: getSwaggerUiHttpMetadata.method,
    url: toFastifyPath(globalPath),
    schema: buildFastifySchema(getSwaggerUiHttpRequestSchema),
    handler: createGetSwaggerUiHandler(),
  });

  // Service-specific Swagger UI
  fastify.withTypeProvider<ZodTypeProvider>().route({
    method: getSwaggerServiceUiHttpMetadata.method,
    url: toFastifyPath(getSwaggerServiceUiHttpMetadata.path),
    schema: buildFastifySchema(getSwaggerServiceUiHttpRequestSchema),
    handler: createGetSwaggerServiceUiHandler(),
  });
}
