import type { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { buildFastifySchema, toFastifyPath } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit/frameworks/fastify';
import {
  applyConfigHttpMetadata,
  applyConfigHttpRequestSchema,
  getConfigHttpMetadata,
  getConfigHttpRequestSchema,
} from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';
import { createGetConfigHandler } from '../../handlers/config/get-config.handler';
import { createApplyConfigHandler } from '../../handlers/config/apply-config.handler';

export async function configRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.withTypeProvider<ZodTypeProvider>().route({
    method: getConfigHttpMetadata.method,
    url: toFastifyPath(getConfigHttpMetadata.path),
    schema: buildFastifySchema(getConfigHttpRequestSchema),
    handler: createGetConfigHandler(),
  });

  fastify.withTypeProvider<ZodTypeProvider>().route({
    method: applyConfigHttpMetadata.method,
    url: toFastifyPath(applyConfigHttpMetadata.path),
    schema: buildFastifySchema(applyConfigHttpRequestSchema),
    handler: createApplyConfigHandler(),
  });
}


