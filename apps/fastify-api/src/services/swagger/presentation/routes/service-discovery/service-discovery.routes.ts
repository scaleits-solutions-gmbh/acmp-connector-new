import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import {
  listServicesHttpMetadata,
  listServicesHttpRequestSchema,
} from "@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit";
import {
  buildFastifySchema,
  toFastifyPath,
} from "@scaleits-solutions-gmbh/org-lib-backend-common-kit/frameworks/fastify";
import { createListServicesHandler } from "../../handlers";

export async function serviceDiscoveryRoutes(fastify: FastifyInstance) {
  fastify.withTypeProvider<ZodTypeProvider>().route({
    method: listServicesHttpMetadata.method,
    url: toFastifyPath(listServicesHttpMetadata.path),
    schema: buildFastifySchema(listServicesHttpRequestSchema),
    handler: createListServicesHandler(),
  });
}
