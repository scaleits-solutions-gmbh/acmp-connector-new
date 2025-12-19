import { FastifyReply, FastifyRequest } from "fastify";
import {
  findPaginatedRolloutTemplatesHttpRequestMapper,
  findPaginatedRolloutTemplatesHttpResponseMapper,
} from "@repo/modules/acmp-connector";
import type { FindPaginatedRolloutTemplatesQueryPrimaryPort } from "@repo/modules/acmp-connector";
import { GetRolloutTemplatesHttpRequest } from "@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit";
import { mapFastifyRequest } from "@scaleits-solutions-gmbh/org-lib-backend-common-kit/frameworks/fastify";

export function createFindPaginatedRolloutTemplatesHandler(
  query: FindPaginatedRolloutTemplatesQueryPrimaryPort,
) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const httpRequest =
      mapFastifyRequest<GetRolloutTemplatesHttpRequest>(request);
    const input = findPaginatedRolloutTemplatesHttpRequestMapper(httpRequest);

    const output = await query.execute(input);
    const response = findPaginatedRolloutTemplatesHttpResponseMapper(output);

    return reply.status(response.statusCode).send(response.body);
  };
}
