import { FastifyReply, FastifyRequest } from 'fastify';
import {
  findPaginatedClientCommandsHttpRequestMapper,
  findPaginatedClientCommandsHttpResponseMapper,
} from '@repo/business/boundaries';
import { FindPaginatedClientCommandsQueryPrimaryPort } from '@repo/business/bounded-contexts/acmp-connector-bounded-context';
import { GetClientCommandsHttpRequest } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';
import { mapFastifyRequest } from '@/utils';

export function createFindPaginatedClientCommandsHandler(
  query: FindPaginatedClientCommandsQueryPrimaryPort,
) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const httpRequest = mapFastifyRequest<GetClientCommandsHttpRequest>(request);
    const input = findPaginatedClientCommandsHttpRequestMapper(httpRequest);

    const output = await query.execute(input);
    const response = findPaginatedClientCommandsHttpResponseMapper(output);

    return reply.status(response.statusCode).send(response.body);
  };
}
