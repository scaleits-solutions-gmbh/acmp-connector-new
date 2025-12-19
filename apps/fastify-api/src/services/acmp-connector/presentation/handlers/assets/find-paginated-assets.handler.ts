import { FastifyReply, FastifyRequest } from "fastify";
import {
  findPaginatedAssetsHttpRequestMapper,
  findPaginatedAssetsHttpResponseMapper,
} from "@repo/modules/acmp-connector";
import type { FindPaginatedAssetsQueryPrimaryPort } from "@repo/modules/acmp-connector";
import { GetAssetsHttpRequest } from "@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit";
import { mapFastifyRequest } from "@scaleits-solutions-gmbh/org-lib-backend-common-kit/frameworks/fastify";

export function createFindPaginatedAssetsHandler(
  query: FindPaginatedAssetsQueryPrimaryPort,
) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const httpRequest = mapFastifyRequest<GetAssetsHttpRequest>(request);
    const input = findPaginatedAssetsHttpRequestMapper(httpRequest);

    const output = await query.execute(input);
    const response = findPaginatedAssetsHttpResponseMapper(output);

    return reply.status(response.statusCode).send(response.body);
  };
}
