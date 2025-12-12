import { FastifyReply, FastifyRequest } from 'fastify';
import {
  findPaginatedTicketsHttpRequestMapper,
  findPaginatedTicketsHttpResponseMapper,
} from '@repo/business/boundaries';
import type { FindPaginatedTicketsQueryPrimaryPort } from '@repo/business/bounded-contexts/acmp-connector-bounded-context';
import { GetTicketsHttpRequest } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';
import { mapFastifyRequest } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit/frameworks/fastify';

export function createFindPaginatedTicketsHandler(
  query: FindPaginatedTicketsQueryPrimaryPort,
) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const httpRequest = mapFastifyRequest<GetTicketsHttpRequest>(request);
    const input = findPaginatedTicketsHttpRequestMapper(httpRequest);

    const output = await query.execute(input);
    const response = findPaginatedTicketsHttpResponseMapper(output);

    return reply.status(response.statusCode).send(response.body);
  };
}
