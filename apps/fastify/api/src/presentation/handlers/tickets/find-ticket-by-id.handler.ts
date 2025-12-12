import { FastifyReply, FastifyRequest } from 'fastify';
import {
  findTicketByIdHttpRequestMapper,
  findTicketByIdHttpResponseMapper,
} from '@repo/business/boundaries';
import type { FindTicketByIdQueryPrimaryPort } from '@repo/business/bounded-contexts/acmp-connector-bounded-context';
import { GetTicketByIdHttpRequest } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';
import { mapFastifyRequest } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit/frameworks/fastify';

export function createFindTicketByIdHandler(
  query: FindTicketByIdQueryPrimaryPort,
) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const httpRequest = mapFastifyRequest<GetTicketByIdHttpRequest>(request);
    const input = findTicketByIdHttpRequestMapper(httpRequest);

    const output = await query.execute(input);
    const response = findTicketByIdHttpResponseMapper(output);

    return reply.status(response.statusCode).send(response.body);
  };
}
