import { FastifyReply, FastifyRequest } from 'fastify';
import {
  findClientByIdHttpRequestMapper,
  findClientByIdHttpResponseMapper,
} from '@repo/business/boundaries';
import type { FindClientByIdQueryPrimaryPort } from '@repo/business/bounded-contexts/acmp-connector-bounded-context';
import { GetClientByIdHttpRequest } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';
import { mapFastifyRequest } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit/frameworks/fastify';

export function createFindClientByIdHandler(
  query: FindClientByIdQueryPrimaryPort,
) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const httpRequest = mapFastifyRequest<GetClientByIdHttpRequest>(request);
    const input = findClientByIdHttpRequestMapper(httpRequest);

    const output = await query.execute(input);
    const response = findClientByIdHttpResponseMapper(output);

    return reply.status(response.statusCode).send(response.body);
  };
}
