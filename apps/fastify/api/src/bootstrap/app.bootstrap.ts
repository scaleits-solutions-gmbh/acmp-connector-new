import Fastify from 'fastify';
import cors from '@fastify/cors';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { bootstrapUseCases } from '@/bootstrap/use-cases.bootstrap';
import { clientsRoutes } from '@/presentation/routes/clients';
import { jobsRoutes } from '@/presentation/routes/jobs';
import { ticketsRoutes } from '@/presentation/routes/tickets';
import { assetsRoutes } from '@/presentation/routes/assets';
import { clientCommandsRoutes } from '@/presentation/routes/client-commands';
import { rolloutTemplatesRoutes } from '@/presentation/routes/rollout-templates';
import { zodValidatorCompiler, zodSerializerCompiler } from '@/utils';
import { apiKeyAuthPlugin } from '@/plugins';

/**
 * Bootstrap the Fastify application with all dependencies
 */
export async function bootstrapApp() {
  const fastify = Fastify({
    logger: true,
  }).withTypeProvider<ZodTypeProvider>();

  // Register custom Zod v4 compatible validation
  fastify.setValidatorCompiler(zodValidatorCompiler);
  fastify.setSerializerCompiler(zodSerializerCompiler);

  // Register plugins
  await fastify.register(cors, {
    origin: true,
  });

  const useCases = bootstrapUseCases;

  // Register routes
  await fastify.register(
    async (instance) => {
      // Register API key authentication for API routes
      await instance.register(apiKeyAuthPlugin, {
        header: 'x-api-key',
        excludeRoutes: [], // No exclusions needed in scoped context
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

  // Health check
  fastify.get('/health', async () => ({ status: 'ok' }));

  return fastify;
}
