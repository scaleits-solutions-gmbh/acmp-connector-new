import { FastifyReply, FastifyRequest } from 'fastify';
import {
  pushClientCommandHttpRequestMapper,
  pushClientCommandHttpResponseMapper,
} from '@repo/business/boundaries';
import { PushClientCommandCommandPrimaryPort } from '@repo/business/bounded-contexts/acmp-connector-bounded-context';
import { PushClientCommandHttpRequest } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';
import { mapFastifyRequest } from '@/utils';

export function createPushClientCommandHandler(
  command: PushClientCommandCommandPrimaryPort,
) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const httpRequest = mapFastifyRequest<PushClientCommandHttpRequest>(request);
    const input = pushClientCommandHttpRequestMapper(httpRequest);

    const output = await command.execute(input);
    const response = pushClientCommandHttpResponseMapper(output);

    return reply.status(response.statusCode).send(response.body);
  };
}

