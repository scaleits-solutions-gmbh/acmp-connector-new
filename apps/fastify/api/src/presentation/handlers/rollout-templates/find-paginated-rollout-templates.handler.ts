import { FastifyReply, FastifyRequest } from 'fastify';
import {
  findPaginatedRolloutTemplatesHttpRequestMapper,
  findPaginatedRolloutTemplatesHttpResponseMapper,
} from '@repo/business/boundaries';
import { FindPaginatedRolloutTemplatesQueryPrimaryPort } from '@repo/business/bounded-contexts/acmp-connector-bounded-context';
import { GetRolloutsHttpRequest } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';
import { mapFastifyRequest } from '@/utils';

export function createFindPaginatedRolloutTemplatesHandler(
  query: FindPaginatedRolloutTemplatesQueryPrimaryPort,
) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const httpRequest = mapFastifyRequest<GetRolloutsHttpRequest>(request);
    const input = findPaginatedRolloutTemplatesHttpRequestMapper(httpRequest);

    const output = await query.execute(input);
    const response = findPaginatedRolloutTemplatesHttpResponseMapper(output);

    return reply.status(response.statusCode).send(response.body);
  };
}
