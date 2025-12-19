/**
 * ACMP Connector Service
 *
 * Fastify plugin that registers all ACMP Connector routes under the /api prefix.
 * Includes API key authentication for protected endpoints.
 */
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import {
  apiKeyAuthPlugin,
  buildFastifySchema,
  toFastifyPath,
} from "@scaleits-solutions-gmbh/org-lib-backend-common-kit/frameworks/fastify";
import {
  acmpConnectorServiceMetadata,
  getHealthHttpMetadata,
  getHealthHttpRequestSchema,
} from "@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit";
import type { UseCases } from "@/bootstrap/use-cases.bootstrap";

// Route modules
import { clientsRoutes } from "./presentation/routes/clients";
import { jobsRoutes } from "./presentation/routes/jobs";
import { ticketsRoutes } from "./presentation/routes/tickets";
import { assetsRoutes } from "./presentation/routes/assets";
import { clientCommandsRoutes } from "./presentation/routes/client-commands";
import { rolloutTemplatesRoutes } from "./presentation/routes/rollout-templates";

export interface AcmpConnectorServiceOptions {
  /**
   * Use cases for the service handlers.
   */
  useCases: UseCases;
}

/**
 * ACMP Connector Service plugin.
 *
 * Registers all ACMP Connector routes with the appropriate prefix and authentication.
 */
export async function acmpConnectorService(
  fastify: FastifyInstance,
  options: AcmpConnectorServiceOptions,
): Promise<void> {
  const { useCases } = options;

  // Health check endpoint (public, no auth required)
  fastify.withTypeProvider<ZodTypeProvider>().route({
    method: getHealthHttpMetadata.method,
    url: toFastifyPath(getHealthHttpMetadata.path),
    schema: buildFastifySchema(getHealthHttpRequestSchema),
    handler: async () => ({
      status: "ok",
      timestamp: new Date().toISOString(),
    }),
  });

  // Register API key authentication for all other routes
  await fastify.register(apiKeyAuthPlugin, {
    header: "x-api-key",
    excludeRoutes: ["/health"], // relative to prefix
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // Resource Routes
  // ─────────────────────────────────────────────────────────────────────────────

  // Clients
  await clientsRoutes(
    fastify,
    useCases.findPaginatedClientsQuery,
    useCases.findClientByIdQuery,
    useCases.findPaginatedClientHardDrivesQuery,
    useCases.findPaginatedClientNetworkCardsQuery,
    useCases.findPaginatedClientInstalledSoftwareQuery,
  );

  // Jobs
  await jobsRoutes(fastify, useCases.findPaginatedJobsQuery);

  // Tickets
  await ticketsRoutes(
    fastify,
    useCases.findPaginatedTicketsQuery,
    useCases.findTicketByIdQuery,
  );

  // Assets
  await assetsRoutes(
    fastify,
    useCases.findPaginatedAssetsQuery,
    useCases.findAssetByIdQuery,
    useCases.findAssetTypesQuery,
  );

  // Client Commands
  await clientCommandsRoutes(
    fastify,
    useCases.findPaginatedClientCommandsQuery,
    useCases.findClientCommandByIdQuery,
    useCases.pushClientCommandCommand,
  );

  // Rollout Templates
  await rolloutTemplatesRoutes(
    fastify,
    useCases.findPaginatedRolloutTemplatesQuery,
    useCases.findRolloutTemplateByIdQuery,
    useCases.pushRolloutTemplateCommand,
  );
}

/**
 * Get the service metadata (base path, name, etc.)
 */
export { acmpConnectorServiceMetadata };
