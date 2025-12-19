import { FastifyReply, FastifyRequest } from "fastify";
import {
  pushRolloutTemplateHttpRequestMapper,
  pushRolloutTemplateHttpResponseMapper,
} from "@repo/modules/acmp-connector";
import type { PushRolloutTemplateCommandPrimaryPort } from "@repo/modules/acmp-connector";
import { PushRolloutTemplateHttpRequest } from "@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit";
import { mapFastifyRequest } from "@scaleits-solutions-gmbh/org-lib-backend-common-kit/frameworks/fastify";

export function createPushRolloutTemplateHandler(
  command: PushRolloutTemplateCommandPrimaryPort,
) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const httpRequest =
      mapFastifyRequest<PushRolloutTemplateHttpRequest>(request);
    const input = pushRolloutTemplateHttpRequestMapper(httpRequest);

    const output = await command.execute(input);
    const response = pushRolloutTemplateHttpResponseMapper(output);

    return reply.status(response.statusCode).send(response.body);
  };
}
