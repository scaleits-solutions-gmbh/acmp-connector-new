import type { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { buildFastifySchema, toFastifyPath } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit/frameworks/fastify';
import {
  getDashboardHttpMetadata,
  getDashboardHttpRequestSchema,
} from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';
import { createGetDashboardHandler } from '../../handlers/dashboard/get-dashboard.handler';

export async function dashboardRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.withTypeProvider<ZodTypeProvider>().route({
    method: getDashboardHttpMetadata.method,
    url: toFastifyPath(getDashboardHttpMetadata.path),
    schema: buildFastifySchema(getDashboardHttpRequestSchema),
    handler: createGetDashboardHandler(),
  });
}


