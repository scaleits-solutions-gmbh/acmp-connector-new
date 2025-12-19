import type { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { buildFastifySchema, toFastifyPath } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit/frameworks/fastify';
import {
  testDatabaseConnectionHttpMetadata,
  testDatabaseConnectionHttpRequestSchema,
  testSicsConnectionHttpMetadata,
  testSicsConnectionHttpRequestSchema,
} from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';
import { createTestDatabaseConnectionHandler } from '../../handlers/connections/test-database-connection.handler';
import { createTestSicsConnectionHandler } from '../../handlers/connections/test-sics-connection.handler';

export async function connectionsRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.withTypeProvider<ZodTypeProvider>().route({
    method: testDatabaseConnectionHttpMetadata.method,
    url: toFastifyPath(testDatabaseConnectionHttpMetadata.path),
    schema: buildFastifySchema(testDatabaseConnectionHttpRequestSchema),
    handler: createTestDatabaseConnectionHandler(),
  });

  fastify.withTypeProvider<ZodTypeProvider>().route({
    method: testSicsConnectionHttpMetadata.method,
    url: toFastifyPath(testSicsConnectionHttpMetadata.path),
    schema: buildFastifySchema(testSicsConnectionHttpRequestSchema),
    handler: createTestSicsConnectionHandler(),
  });
}


