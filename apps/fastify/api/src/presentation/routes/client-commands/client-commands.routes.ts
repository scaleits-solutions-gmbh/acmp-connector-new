import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import {
  getClientCommandsHttpMetadata,
  getClientCommandsHttpRequestSchema,
  getClientCommandByIdHttpMetadata,
  getClientCommandByIdHttpRequestSchema,
  pushClientCommandHttpMetadata,
  pushClientCommandHttpRequestSchema,
} from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';
import {
  FindPaginatedClientCommandsQueryPrimaryPort,
  FindClientCommandByIdQueryPrimaryPort,
  PushClientCommandCommandPrimaryPort,
} from '@repo/business/bounded-contexts/acmp-connector-bounded-context';
import { createFindPaginatedClientCommandsHandler } from '@/presentation/handlers/client-commands/find-paginated-client-commands.handler';
import { createFindClientCommandByIdHandler } from '@/presentation/handlers/client-commands/find-client-command-by-id.handler';
import { createPushClientCommandHandler } from '@/presentation/handlers/client-commands/push-client-command.handler';
import { buildFastifySchema, toFastifyPath } from '@/utils';

export async function clientCommandsRoutes(
  fastify: FastifyInstance,
  findPaginatedClientCommandsQuery: FindPaginatedClientCommandsQueryPrimaryPort,
  findClientCommandByIdQuery: FindClientCommandByIdQueryPrimaryPort,
  pushClientCommandCommand: PushClientCommandCommandPrimaryPort,
) {
  fastify.withTypeProvider<ZodTypeProvider>().route({
    method: getClientCommandsHttpMetadata.method,
    url: toFastifyPath(getClientCommandsHttpMetadata.path),
    schema: buildFastifySchema(getClientCommandsHttpRequestSchema),
    handler: createFindPaginatedClientCommandsHandler(findPaginatedClientCommandsQuery),
  });

  fastify.withTypeProvider<ZodTypeProvider>().route({
    method: getClientCommandByIdHttpMetadata.method,
    url: toFastifyPath(getClientCommandByIdHttpMetadata.path),
    schema: buildFastifySchema(getClientCommandByIdHttpRequestSchema),
    handler: createFindClientCommandByIdHandler(findClientCommandByIdQuery),
  });

  fastify.withTypeProvider<ZodTypeProvider>().route({
    method: pushClientCommandHttpMetadata.method,
    url: toFastifyPath(pushClientCommandHttpMetadata.path),
    schema: buildFastifySchema(pushClientCommandHttpRequestSchema),
    handler: createPushClientCommandHandler(pushClientCommandCommand),
  });
}
