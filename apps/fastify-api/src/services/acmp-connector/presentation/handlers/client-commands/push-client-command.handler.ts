import { FastifyReply, FastifyRequest } from "fastify";
import {
  pushClientCommandHttpRequestMapper,
  pushClientCommandHttpResponseMapper,
} from "@repo/modules/acmp-connector";
import type { PushClientCommandCommandPrimaryPort } from "@repo/modules/acmp-connector";
import { PushClientCommandHttpRequest } from "@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit";
import { mapFastifyRequest } from "@scaleits-solutions-gmbh/org-lib-backend-common-kit/frameworks/fastify";

export function createPushClientCommandHandler(
  command: PushClientCommandCommandPrimaryPort,
) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const httpRequest =
      mapFastifyRequest<PushClientCommandHttpRequest>(request);
    const input = pushClientCommandHttpRequestMapper(httpRequest);

    const output = await command.execute(input);
    const response = pushClientCommandHttpResponseMapper(output);

    return reply.status(response.statusCode).send(response.body);
  };
}
