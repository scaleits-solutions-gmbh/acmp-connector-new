import { FastifyReply, FastifyRequest } from 'fastify';
import type { ApplyConfigHttpRequest, ApplyConfigHttpResponse } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';
import { mapFastifyRequest } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit/frameworks/fastify';

/**
 * NOTE:
 * This is a stub implementation to establish the route + schema contract.
 * Persisting to a config store and restarting the process should be implemented
 * in infrastructure/use-cases.
 */
export function createApplyConfigHandler() {
  return async (
    request: FastifyRequest,
    reply: FastifyReply,
  ) => {
    // Here we'd persist request.body and trigger a restart.
    // For now, just acknowledge.
    const httpRequest = mapFastifyRequest<ApplyConfigHttpRequest>(request);
    void httpRequest;

    const response: ApplyConfigHttpResponse = {
      statusCode: 202,
      body: { ok: true },
    };

    return reply.status(response.statusCode).send(response.body);
  };
}


