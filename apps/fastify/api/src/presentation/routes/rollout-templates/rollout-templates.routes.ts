import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import {
  getRolloutTemplatesHttpMetadata,
  getRolloutTemplatesHttpRequestSchema,
  getRolloutTemplateByIdHttpMetadata,
  getRolloutTemplateByIdHttpRequestSchema,
  pushRolloutTemplateHttpMetadata,
  pushRolloutTemplateHttpRequestSchema,
} from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';
import {
  FindPaginatedRolloutTemplatesQueryPrimaryPort,
  FindRolloutTemplateByIdQueryPrimaryPort,
  PushRolloutTemplateCommandPrimaryPort,
} from '@repo/business/bounded-contexts/acmp-connector-bounded-context';
import { createFindPaginatedRolloutTemplatesHandler } from '@/presentation/handlers/rollout-templates/find-paginated-rollout-templates.handler';
import { createFindRolloutTemplateByIdHandler } from '@/presentation/handlers/rollout-templates/find-rollout-template-by-id.handler';
import { createPushRolloutTemplateHandler } from '@/presentation/handlers/rollout-templates/push-rollout-template.handler';
import { buildFastifySchema, toFastifyPath } from '@/utils';

export async function rolloutTemplatesRoutes(
  fastify: FastifyInstance,
  findPaginatedRolloutTemplatesQuery: FindPaginatedRolloutTemplatesQueryPrimaryPort,
  findRolloutTemplateByIdQuery: FindRolloutTemplateByIdQueryPrimaryPort,
  pushRolloutTemplateCommand: PushRolloutTemplateCommandPrimaryPort,
) {
  fastify.withTypeProvider<ZodTypeProvider>().route({
    method: getRolloutTemplatesHttpMetadata.method,
    url: toFastifyPath(getRolloutTemplatesHttpMetadata.path),
    schema: buildFastifySchema(getRolloutTemplatesHttpRequestSchema),
    handler: createFindPaginatedRolloutTemplatesHandler(findPaginatedRolloutTemplatesQuery),
  });

  fastify.withTypeProvider<ZodTypeProvider>().route({
    method: getRolloutTemplateByIdHttpMetadata.method,
    url: toFastifyPath(getRolloutTemplateByIdHttpMetadata.path),
    schema: buildFastifySchema(getRolloutTemplateByIdHttpRequestSchema),
    handler: createFindRolloutTemplateByIdHandler(findRolloutTemplateByIdQuery),
  });

  fastify.withTypeProvider<ZodTypeProvider>().route({
    method: pushRolloutTemplateHttpMetadata.method,
    url: toFastifyPath(pushRolloutTemplateHttpMetadata.path),
    schema: buildFastifySchema(pushRolloutTemplateHttpRequestSchema),
    handler: createPushRolloutTemplateHandler(pushRolloutTemplateCommand),
  });
}
