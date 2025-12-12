import { FastifyReply, FastifyRequest } from 'fastify';
import {
  findClientCommandByIdHttpRequestMapper,
  findClientCommandByIdHttpResponseMapper,
} from '@repo/business/boundaries';
import type { FindClientCommandByIdQueryPrimaryPort } from '@repo/business/bounded-contexts/acmp-connector-bounded-context';
import { GetClientCommandByIdHttpRequest } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';
import { mapFastifyRequest } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit/frameworks/fastify';

export function createFindClientCommandByIdHandler(
  query: FindClientCommandByIdQueryPrimaryPort,
) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const httpRequest = mapFastifyRequest<GetClientCommandByIdHttpRequest>(request);
    const input = findClientCommandByIdHttpRequestMapper(httpRequest);

    const output = await query.execute(input);
    const response = findClientCommandByIdHttpResponseMapper(output);

    return reply.status(response.statusCode).send(response.body);
  };
}
