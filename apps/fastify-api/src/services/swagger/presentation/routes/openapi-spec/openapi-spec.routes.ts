import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import {
  getGlobalOpenApiSpecHttpMetadata,
  getGlobalOpenApiSpecHttpRequestSchema,
  getServiceOpenApiSpecHttpMetadata,
  getServiceOpenApiSpecHttpRequestSchema,
} from "@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit";
import {
  buildFastifySchema,
  toFastifyPath,
} from "@scaleits-solutions-gmbh/org-lib-backend-common-kit/frameworks/fastify";
import {
  createGetGlobalOpenApiSpecHandler,
  createGetServiceOpenApiSpecHandler,
} from "../../handlers";

export async function openapiSpecRoutes(fastify: FastifyInstance) {
  // Global OpenAPI spec
  fastify.withTypeProvider<ZodTypeProvider>().route({
    method: getGlobalOpenApiSpecHttpMetadata.method,
    url: toFastifyPath(getGlobalOpenApiSpecHttpMetadata.path),
    schema: buildFastifySchema(getGlobalOpenApiSpecHttpRequestSchema),
    handler: createGetGlobalOpenApiSpecHandler(),
  });

  // Service-specific OpenAPI spec
  fastify.withTypeProvider<ZodTypeProvider>().route({
    method: getServiceOpenApiSpecHttpMetadata.method,
    url: toFastifyPath(getServiceOpenApiSpecHttpMetadata.path),
    schema: buildFastifySchema(getServiceOpenApiSpecHttpRequestSchema),
    handler: createGetServiceOpenApiSpecHandler(),
  });
}
