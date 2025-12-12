import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import {
  getAssetsHttpMetadata,
  getAssetsHttpRequestSchema,
  getAssetByIdHttpMetadata,
  getAssetByIdHttpRequestSchema,
  getAssetTypesHttpMetadata,
  getAssetTypesHttpRequestSchema,
} from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';
import type {
  FindPaginatedAssetsQueryPrimaryPort,
  FindAssetByIdQueryPrimaryPort,
  FindAssetTypesQueryPrimaryPort,
} from '@repo/business/bounded-contexts/acmp-connector-bounded-context';
import { buildFastifySchema, toFastifyPath } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit/frameworks/fastify';
import { createFindPaginatedAssetsHandler } from '@/presentation/handlers/assets/find-paginated-assets.handler';
import { createFindAssetByIdHandler } from '@/presentation/handlers/assets/find-asset-by-id.handler';
import { createFindAssetTypesHandler } from '@/presentation/handlers/assets/find-asset-types.handler';

export async function assetsRoutes(
  fastify: FastifyInstance,
  findPaginatedAssetsQuery: FindPaginatedAssetsQueryPrimaryPort,
  findAssetByIdQuery: FindAssetByIdQueryPrimaryPort,
  findAssetTypesQuery: FindAssetTypesQueryPrimaryPort,
) {
  fastify.withTypeProvider<ZodTypeProvider>().route({
    method: getAssetsHttpMetadata.method,
    url: toFastifyPath(getAssetsHttpMetadata.path),
    schema: buildFastifySchema(getAssetsHttpRequestSchema),
    handler: createFindPaginatedAssetsHandler(findPaginatedAssetsQuery),
  });

  fastify.withTypeProvider<ZodTypeProvider>().route({
    method: getAssetByIdHttpMetadata.method,
    url: toFastifyPath(getAssetByIdHttpMetadata.path),
    schema: buildFastifySchema(getAssetByIdHttpRequestSchema),
    handler: createFindAssetByIdHandler(findAssetByIdQuery),
  });

  fastify.withTypeProvider<ZodTypeProvider>().route({
    method: getAssetTypesHttpMetadata.method,
    url: toFastifyPath(getAssetTypesHttpMetadata.path),
    schema: buildFastifySchema(getAssetTypesHttpRequestSchema),
    handler: createFindAssetTypesHandler(findAssetTypesQuery),
  });
}
