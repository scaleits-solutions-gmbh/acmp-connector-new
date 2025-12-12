import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import {
  getJobsHttpMetadata,
  getJobsHttpRequestSchema,
} from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';
import type {
  FindPaginatedJobsQueryPrimaryPort,
} from '@repo/business/bounded-contexts/acmp-connector-bounded-context';
import { buildFastifySchema, toFastifyPath } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit/frameworks/fastify';
import { createFindPaginatedJobsHandler } from '@/presentation/handlers/jobs/find-paginated-jobs.handler';

export async function jobsRoutes(
  fastify: FastifyInstance,
  findPaginatedJobsQuery: FindPaginatedJobsQueryPrimaryPort,
) {
  fastify.withTypeProvider<ZodTypeProvider>().route({
    method: getJobsHttpMetadata.method,
    url: toFastifyPath(getJobsHttpMetadata.path),
    schema: buildFastifySchema(getJobsHttpRequestSchema),
    handler: createFindPaginatedJobsHandler(findPaginatedJobsQuery),
  });
}
