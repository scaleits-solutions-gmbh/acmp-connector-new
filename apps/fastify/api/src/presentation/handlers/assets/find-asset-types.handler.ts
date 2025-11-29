import { FastifyReply, FastifyRequest } from 'fastify';
import {
  findAssetTypesHttpRequestMapper,
  findAssetTypesHttpResponseMapper,
} from '@repo/business/boundaries';
import { FindAssetTypesQueryPrimaryPort } from '@repo/business/bounded-contexts/acmp-connector-bounded-context';
import { GetAssetTypesHttpRequest } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';
import { mapFastifyRequest } from '@/utils';

export function createFindAssetTypesHandler(
  query: FindAssetTypesQueryPrimaryPort,
) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const httpRequest = mapFastifyRequest<GetAssetTypesHttpRequest>(request);
    const input = findAssetTypesHttpRequestMapper(httpRequest);

    const output = await query.execute(input);
    const response = findAssetTypesHttpResponseMapper(output);

    return reply.status(response.statusCode).send(response.body);
  };
}
