import { FastifyReply, FastifyRequest } from "fastify";
import {
  findPaginatedClientCommandsHttpRequestMapper,
  findPaginatedClientCommandsHttpResponseMapper,
} from "@repo/modules/acmp-connector";
import type { FindPaginatedClientCommandsQueryPrimaryPort } from "@repo/modules/acmp-connector";
import { GetClientCommandsHttpRequest } from "@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit";
import { mapFastifyRequest } from "@scaleits-solutions-gmbh/org-lib-backend-common-kit/frameworks/fastify";

export function createFindPaginatedClientCommandsHandler(
  query: FindPaginatedClientCommandsQueryPrimaryPort,
) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const httpRequest =
      mapFastifyRequest<GetClientCommandsHttpRequest>(request);
    const input = findPaginatedClientCommandsHttpRequestMapper(httpRequest);

    const output = await query.execute(input);
    const response = findPaginatedClientCommandsHttpResponseMapper(output);

    return reply.status(response.statusCode).send(response.body);
  };
}
