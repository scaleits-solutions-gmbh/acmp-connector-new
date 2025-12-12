import Fastify from 'fastify';
import cors from '@fastify/cors';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import {
  apiKeyAuthPlugin,
  globalExceptionHandlerPlugin,
  zodSerializerCompiler,
  zodValidatorCompiler,
} from '@scaleits-solutions-gmbh/org-lib-backend-common-kit/frameworks/fastify';
import {
  getHealthHttpMetadata,
  getHealthHttpRequestSchema,
} from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';
import type { UseCases } from '@/bootstrap/use-cases.bootstrap';
import { clientsRoutes } from '@/presentation/routes/clients';
import { jobsRoutes } from '@/presentation/routes/jobs';
import { ticketsRoutes } from '@/presentation/routes/tickets';
import { assetsRoutes } from '@/presentation/routes/assets';
import { clientCommandsRoutes } from '@/presentation/routes/client-commands';
import { rolloutTemplatesRoutes } from '@/presentation/routes/rollout-templates';
import { buildFastifySchema, toFastifyPath } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit/frameworks/fastify';

export interface BootstrapAppOptions {
  /**
   * Inject custom use-cases (useful for tests).
   */
  useCases?: UseCases;

  /**
   * Fastify logger configuration.
   * - `true` enables logging
   * - `false` disables logging (useful for tests)
   * @default true
   */
  logger?: boolean;
}

/**
 * Bootstrap the Fastify application with all dependencies
 */
export async function bootstrapApp(options: BootstrapAppOptions = {}) {
  const fastify = Fastify({
    logger: options.logger ?? true,
  }).withTypeProvider<ZodTypeProvider>();

  // Register custom Zod v4 compatible validation
  fastify.setValidatorCompiler(zodValidatorCompiler);
  fastify.setSerializerCompiler(zodSerializerCompiler);

  // Register plugins
  await fastify.register(globalExceptionHandlerPlugin, {
    // Keep safe defaults; override per app if needed
    exposeInternalErrors: process.env.NODE_ENV !== 'production',
  });

  await fastify.register(cors, {
    origin: true,
  });

  // Lazily import the default use-cases only when needed.
  // This allows tests to inject fakes without loading the full DI graph.
  const useCases =
    options.useCases ?? (await import('@/bootstrap/use-cases.bootstrap')).bootstrapUseCases;

  // Register routes
  await fastify.register(
    async (instance) => {
      // Health check (contracted)
      instance.withTypeProvider<ZodTypeProvider>().route({
        method: getHealthHttpMetadata.method,
        url: toFastifyPath(getHealthHttpMetadata.path),
        schema: buildFastifySchema(getHealthHttpRequestSchema),
        handler: async () => ({
          status: 'ok',
          timestamp: new Date().toISOString(),
        }),
      });

      // Register API key authentication for API routes
      await instance.register(apiKeyAuthPlugin, {
        header: 'x-api-key',
        excludeRoutes: ['/api/health', '/health'], // allow health checks without API key
      });
      // Clients
      await clientsRoutes(
        instance,
        useCases.findPaginatedClientsQuery,
        useCases.findClientByIdQuery,
        useCases.findPaginatedClientHardDrivesQuery,
        useCases.findPaginatedClientNetworkCardsQuery,
        useCases.findPaginatedClientInstalledSoftwareQuery,
      );

      // Jobs
      await jobsRoutes(instance, useCases.findPaginatedJobsQuery);

      // Tickets
      await ticketsRoutes(
        instance,
        useCases.findPaginatedTicketsQuery,
        useCases.findTicketByIdQuery,
      );

      // Assets
      await assetsRoutes(
        instance,
        useCases.findPaginatedAssetsQuery,
        useCases.findAssetByIdQuery,
        useCases.findAssetTypesQuery,
      );

      // Client Commands
      await clientCommandsRoutes(
        instance,
        useCases.findPaginatedClientCommandsQuery,
        useCases.findClientCommandByIdQuery,
        useCases.pushClientCommandCommand,
      );

      // Rollout Templates
      await rolloutTemplatesRoutes(
        instance,
        useCases.findPaginatedRolloutTemplatesQuery,
        useCases.findRolloutTemplateByIdQuery,
        useCases.pushRolloutTemplateCommand,
      );
    },
    { prefix: '/api' },
  );

  // Health check (legacy, non-prefixed)
  fastify.get('/health', async () => ({
    status: 'ok',
    timestamp: new Date().toISOString(),
  }));

  return fastify;
}
