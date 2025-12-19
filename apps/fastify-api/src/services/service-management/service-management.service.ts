/**
 * Service Management Service
 *
 * Fastify plugin that registers local operational routes under /service-management.
 * These endpoints are intended to be accessed only from the embedded admin panel.
 */
import type { FastifyInstance } from 'fastify';
import { dashboardRoutes, configRoutes, connectionsRoutes } from './presentation/routes';

export async function serviceManagementService(
  fastify: FastifyInstance
): Promise<void> {
  await dashboardRoutes(fastify);
  await configRoutes(fastify);
  await connectionsRoutes(fastify);
}


