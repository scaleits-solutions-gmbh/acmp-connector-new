import { FastifyReply, FastifyRequest } from 'fastify';
import {
  findPaginatedClientHardDrivesHttpRequestMapper,
  findPaginatedClientHardDrivesHttpResponseMapper,
} from '@repo/business/boundaries';
import type { FindPaginatedClientHardDrivesQueryPrimaryPort } from '@repo/business/bounded-contexts/acmp-connector-bounded-context';
import { GetClientHardDrivesHttpRequest } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';
import { mapFastifyRequest } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit/frameworks/fastify';

export function createFindPaginatedClientHardDrivesHandler(
  query: FindPaginatedClientHardDrivesQueryPrimaryPort,
) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const httpRequest = mapFastifyRequest<GetClientHardDrivesHttpRequest>(request);
    const input = findPaginatedClientHardDrivesHttpRequestMapper(httpRequest);

    const output = await query.execute(input);
    const response = findPaginatedClientHardDrivesHttpResponseMapper(output);

    return reply.status(response.statusCode).send(response.body);
  };
}
