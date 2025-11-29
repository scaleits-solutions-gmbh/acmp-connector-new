import { FastifyReply, FastifyRequest } from 'fastify';
import {
  findPaginatedJobsHttpRequestMapper,
  findPaginatedJobsHttpResponseMapper,
} from '@repo/business/boundaries';
import { FindPaginatedJobsQueryPrimaryPort } from '@repo/business/bounded-contexts/acmp-connector-bounded-context';
import { GetJobsHttpRequest } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';
import { mapFastifyRequest } from '@/utils';

export function createFindPaginatedJobsHandler(
  query: FindPaginatedJobsQueryPrimaryPort,
) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const httpRequest = mapFastifyRequest<GetJobsHttpRequest>(request);
    const input = findPaginatedJobsHttpRequestMapper(httpRequest);

    const output = await query.execute(input);
    const response = findPaginatedJobsHttpResponseMapper(output);

    return reply.status(response.statusCode).send(response.body);
  };
}
