import { FastifyReply, FastifyRequest } from 'fastify';
import {
  pushRolloutTemplateHttpRequestMapper,
  pushRolloutTemplateHttpResponseMapper,
} from '@repo/business/boundaries';
import { PushRolloutTemplateCommandPrimaryPort } from '@repo/business/bounded-contexts/acmp-connector-bounded-context';
import { PushRolloutTemplateHttpRequest } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';
import { mapFastifyRequest } from '@/utils';

export function createPushRolloutTemplateHandler(
  command: PushRolloutTemplateCommandPrimaryPort,
) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const httpRequest = mapFastifyRequest<PushRolloutTemplateHttpRequest>(request);
    const input = pushRolloutTemplateHttpRequestMapper(httpRequest);

    const output = await command.execute(input);
    const response = pushRolloutTemplateHttpResponseMapper(output);

    return reply.status(response.statusCode).send(response.body);
  };
}

