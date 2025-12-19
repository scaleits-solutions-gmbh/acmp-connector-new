import { FastifyReply, FastifyRequest } from "fastify";
import {
  findPaginatedClientsHttpRequestMapper,
  findPaginatedClientsHttpResponseMapper,
} from "@repo/modules/acmp-connector";
import type { FindPaginatedClientsQueryPrimaryPort } from "@repo/modules/acmp-connector";
import { GetClientsHttpRequest } from "@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit";
import { mapFastifyRequest } from "@scaleits-solutions-gmbh/org-lib-backend-common-kit/frameworks/fastify";

export function createFindPaginatedClientsHandler(
  query: FindPaginatedClientsQueryPrimaryPort,
) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const httpRequest = mapFastifyRequest<GetClientsHttpRequest>(request);
    const input = findPaginatedClientsHttpRequestMapper(httpRequest);

    const output = await query.execute(input);
    const response = findPaginatedClientsHttpResponseMapper(output);

    return reply.status(response.statusCode).send(response.body);
  };
}
