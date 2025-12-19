import type { FastifyReply, FastifyRequest } from 'fastify';
import type { TestDatabaseConnectionHttpResponse } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';

export function createTestDatabaseConnectionHandler() {
  return async (_request: FastifyRequest, reply: FastifyReply) => {
    // Stubbed result: if config is missing, treat as connection_error
    const hasConfig = Boolean(process.env.DB_SERVER) && Boolean(process.env.DB_NAME);

    const response: TestDatabaseConnectionHttpResponse = {
      statusCode: 200,
      body: hasConfig
        ? { status: 'connected', latencyMs: 8 }
        : { status: 'connection_error', latencyMs: null },
    };

    return reply.status(response.statusCode).send(response.body);
  };
}
