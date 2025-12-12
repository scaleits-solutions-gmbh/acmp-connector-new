import { FastifyReply, FastifyRequest } from 'fastify';
import {
  findRolloutTemplateByIdHttpRequestMapper,
  findRolloutTemplateByIdHttpResponseMapper,
} from '@repo/business/boundaries';
import type { FindRolloutTemplateByIdQueryPrimaryPort } from '@repo/business/bounded-contexts/acmp-connector-bounded-context';
import { GetRolloutTemplateByIdHttpRequest } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';
import { mapFastifyRequest } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit/frameworks/fastify';

export function createFindRolloutTemplateByIdHandler(
  query: FindRolloutTemplateByIdQueryPrimaryPort,
) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const httpRequest = mapFastifyRequest<GetRolloutTemplateByIdHttpRequest>(request);
    const input = findRolloutTemplateByIdHttpRequestMapper(httpRequest);

    const output = await query.execute(input);
    const response = findRolloutTemplateByIdHttpResponseMapper(output);

    return reply.status(response.statusCode).send(response.body);
  };
}
