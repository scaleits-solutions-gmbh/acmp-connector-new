import { FastifyReply, FastifyRequest } from 'fastify';
import {
  findPaginatedClientInstalledSoftwareHttpRequestMapper,
  findPaginatedClientInstalledSoftwareHttpResponseMapper,
} from '@repo/business/boundaries';
import { FindPaginatedClientInstalledSoftwareQueryPrimaryPort } from '@repo/business/bounded-contexts/acmp-connector-bounded-context';
import { GetClientInstalledSoftwareHttpRequest } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';
import { mapFastifyRequest } from '@/utils';

export function createFindPaginatedClientInstalledSoftwareHandler(
  query: FindPaginatedClientInstalledSoftwareQueryPrimaryPort,
) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const httpRequest = mapFastifyRequest<GetClientInstalledSoftwareHttpRequest>(request);
    const input = findPaginatedClientInstalledSoftwareHttpRequestMapper(httpRequest);

    const output = await query.execute(input);
    const response = findPaginatedClientInstalledSoftwareHttpResponseMapper(output);

    return reply.status(response.statusCode).send(response.body);
  };
}
