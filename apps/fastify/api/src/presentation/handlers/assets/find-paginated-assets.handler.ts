import { FastifyReply, FastifyRequest } from 'fastify';
import {
  findPaginatedAssetsHttpRequestMapper,
  findPaginatedAssetsHttpResponseMapper,
} from '@repo/business/boundaries';
import { FindPaginatedAssetsQueryPrimaryPort } from '@repo/business/bounded-contexts/acmp-connector-bounded-context';
import { GetAssetsHttpRequest } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';
import { mapFastifyRequest } from '@/utils';

export function createFindPaginatedAssetsHandler(
  query: FindPaginatedAssetsQueryPrimaryPort,
) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const httpRequest = mapFastifyRequest<GetAssetsHttpRequest>(request);
    const input = findPaginatedAssetsHttpRequestMapper(httpRequest);

    const output = await query.execute(input);
    const response = findPaginatedAssetsHttpResponseMapper(output);

    return reply.status(response.statusCode).send(response.body);
  };
}
