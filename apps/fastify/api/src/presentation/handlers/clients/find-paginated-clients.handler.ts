import { FastifyReply, FastifyRequest } from 'fastify';
import {
  findPaginatedClientsHttpRequestMapper,
  findPaginatedClientsHttpResponseMapper,
} from '@repo/business/boundaries';
import { FindPaginatedClientsQueryPrimaryPort } from '@repo/business/bounded-contexts/acmp-connector-bounded-context';
import { GetClientsHttpRequest } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';
import { mapFastifyRequest } from '@/utils';

export function createFindPaginatedClientsHandler(
  query: FindPaginatedClientsQueryPrimaryPort,
) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const httpRequest = mapFastifyRequest<GetClientsHttpRequest>(request);
    const input = findPaginatedClientsHttpRequestMapper(httpRequest);

    const output = await query.execute(input);
    const response = findPaginatedClientsHttpResponseMapper(output);

    return reply.status(response.statusCode).send(response.body);
  };
}

