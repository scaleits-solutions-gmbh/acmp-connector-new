import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import {
  getClientsHttpMetadata,
  getClientsHttpRequestSchema,
  getClientByIdHttpMetadata,
  getClientByIdHttpRequestSchema,
  getClientHardDrivesHttpMetadata,
  getClientHardDrivesHttpRequestSchema,
  getClientNetworkCardsHttpMetadata,
  getClientNetworkCardsHttpRequestSchema,
  getClientInstalledSoftwareHttpMetadata,
  getClientInstalledSoftwareHttpRequestSchema,
} from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';
import type {
  FindPaginatedClientsQueryPrimaryPort,
  FindClientByIdQueryPrimaryPort,
  FindPaginatedClientHardDrivesQueryPrimaryPort,
  FindPaginatedClientNetworkCardsQueryPrimaryPort,
  FindPaginatedClientInstalledSoftwareQueryPrimaryPort,
} from '@repo/business/bounded-contexts/acmp-connector-bounded-context';
import { buildFastifySchema, toFastifyPath } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit/frameworks/fastify';
import { createFindPaginatedClientsHandler } from '@/presentation/handlers/clients/find-paginated-clients.handler';
import { createFindClientByIdHandler } from '@/presentation/handlers/clients/find-client-by-id.handler';
import { createFindPaginatedClientHardDrivesHandler } from '@/presentation/handlers/clients/find-paginated-client-hard-drives.handler';
import { createFindPaginatedClientNetworkCardsHandler } from '@/presentation/handlers/clients/find-paginated-client-network-cards.handler';
import { createFindPaginatedClientInstalledSoftwareHandler } from '@/presentation/handlers/clients/find-paginated-client-installed-software.handler';

export async function clientsRoutes(
  fastify: FastifyInstance,
  findPaginatedClientsQuery: FindPaginatedClientsQueryPrimaryPort,
  findClientByIdQuery: FindClientByIdQueryPrimaryPort,
  findPaginatedClientHardDrivesQuery: FindPaginatedClientHardDrivesQueryPrimaryPort,
  findPaginatedClientNetworkCardsQuery: FindPaginatedClientNetworkCardsQueryPrimaryPort,
  findPaginatedClientInstalledSoftwareQuery: FindPaginatedClientInstalledSoftwareQueryPrimaryPort,
) {
  fastify.withTypeProvider<ZodTypeProvider>().route({
    method: getClientsHttpMetadata.method,
    url: toFastifyPath(getClientsHttpMetadata.path),
    schema: buildFastifySchema(getClientsHttpRequestSchema),
    handler: createFindPaginatedClientsHandler(findPaginatedClientsQuery),
  });

  fastify.withTypeProvider<ZodTypeProvider>().route({
    method: getClientByIdHttpMetadata.method,
    url: toFastifyPath(getClientByIdHttpMetadata.path),
    schema: buildFastifySchema(getClientByIdHttpRequestSchema),
    handler: createFindClientByIdHandler(findClientByIdQuery),
  });

  fastify.withTypeProvider<ZodTypeProvider>().route({
    method: getClientHardDrivesHttpMetadata.method,
    url: toFastifyPath(getClientHardDrivesHttpMetadata.path),
    schema: buildFastifySchema(getClientHardDrivesHttpRequestSchema),
    handler: createFindPaginatedClientHardDrivesHandler(findPaginatedClientHardDrivesQuery),
  });

  fastify.withTypeProvider<ZodTypeProvider>().route({
    method: getClientNetworkCardsHttpMetadata.method,
    url: toFastifyPath(getClientNetworkCardsHttpMetadata.path),
    schema: buildFastifySchema(getClientNetworkCardsHttpRequestSchema),
    handler: createFindPaginatedClientNetworkCardsHandler(findPaginatedClientNetworkCardsQuery),
  });

  fastify.withTypeProvider<ZodTypeProvider>().route({
    method: getClientInstalledSoftwareHttpMetadata.method,
    url: toFastifyPath(getClientInstalledSoftwareHttpMetadata.path),
    schema: buildFastifySchema(getClientInstalledSoftwareHttpRequestSchema),
    handler: createFindPaginatedClientInstalledSoftwareHandler(findPaginatedClientInstalledSoftwareQuery),
  });
}
