import { FastifyReply, FastifyRequest } from 'fastify';
import {
  findAssetByIdHttpRequestMapper,
  findAssetByIdHttpResponseMapper,
} from '@repo/business/boundaries';
import type { FindAssetByIdQueryPrimaryPort } from '@repo/business/bounded-contexts/acmp-connector-bounded-context';
import { GetAssetByIdHttpRequest } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';
import { mapFastifyRequest } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit/frameworks/fastify';

export function createFindAssetByIdHandler(
  query: FindAssetByIdQueryPrimaryPort,
) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const httpRequest = mapFastifyRequest<GetAssetByIdHttpRequest>(request);
    const input = findAssetByIdHttpRequestMapper(httpRequest);

    const output = await query.execute(input);
    const response = findAssetByIdHttpResponseMapper(output);

    return reply.status(response.statusCode).send(response.body);
  };
}
