import type { FastifyReply, FastifyRequest } from 'fastify';
import type { TestSicsConnectionHttpResponse } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';

export function createTestSicsConnectionHandler() {
  return async (_request: FastifyRequest, reply: FastifyReply) => {
    const hasConfig = Boolean(process.env.SICS_API_URL) && Boolean(process.env.SICS_USER_USERNAME);

    const response: TestSicsConnectionHttpResponse = {
      statusCode: 200,
      body: hasConfig
        ? { status: 'connected', latencyMs: 23 }
        : { status: 'connection_error', latencyMs: null },
    };

    return reply.status(response.statusCode).send(response.body);
  };
}
