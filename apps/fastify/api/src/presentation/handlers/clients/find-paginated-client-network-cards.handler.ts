import { FastifyReply, FastifyRequest } from 'fastify';
import {
  findPaginatedClientNetworkCardsHttpRequestMapper,
  findPaginatedClientNetworkCardsHttpResponseMapper,
} from '@repo/business/boundaries';
import { FindPaginatedClientNetworkCardsQueryPrimaryPort } from '@repo/business/bounded-contexts/acmp-connector-bounded-context';
import { GetClientNetworkCardsHttpRequest } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';
import { mapFastifyRequest } from '@/utils';

export function createFindPaginatedClientNetworkCardsHandler(
  query: FindPaginatedClientNetworkCardsQueryPrimaryPort,
) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const httpRequest = mapFastifyRequest<GetClientNetworkCardsHttpRequest>(request);
    const input = findPaginatedClientNetworkCardsHttpRequestMapper(httpRequest);

    const output = await query.execute(input);
    const response = findPaginatedClientNetworkCardsHttpResponseMapper(output);

    return reply.status(response.statusCode).send(response.body);
  };
}
