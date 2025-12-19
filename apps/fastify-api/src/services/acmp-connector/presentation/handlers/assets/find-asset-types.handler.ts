import { FastifyReply, FastifyRequest } from "fastify";
import {
  findAssetTypesHttpRequestMapper,
  findAssetTypesHttpResponseMapper,
} from "@repo/modules/acmp-connector";
import type { FindAssetTypesQueryPrimaryPort } from "@repo/modules/acmp-connector";
import { GetAssetTypesHttpRequest } from "@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit";
import { mapFastifyRequest } from "@scaleits-solutions-gmbh/org-lib-backend-common-kit/frameworks/fastify";

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
