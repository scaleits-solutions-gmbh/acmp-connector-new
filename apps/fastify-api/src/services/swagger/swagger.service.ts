/**
 * Swagger Service
 *
 * Fastify plugin that registers all Swagger/OpenAPI documentation routes.
 * Provides Scalar UI for interactive API documentation and serves OpenAPI JSON specs.
 *
 * All routes are public (no authentication required).
 */
import { FastifyInstance } from "fastify";
import { swaggerServiceMetadata } from "@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit";

// Route modules
import { openapiSpecRoutes } from "./presentation/routes/openapi-spec";
import { swaggerUiRoutes } from "./presentation/routes/swagger-ui";
import { serviceDiscoveryRoutes } from "./presentation/routes/service-discovery";

export interface SwaggerServiceOptions {
  // No options needed for now, but keeping interface for future extensibility
}

/**
 * Swagger Service plugin.
 *
 * Registers all Swagger/OpenAPI documentation routes:
 * - UI routes (Scalar HTML pages)
 * - OpenAPI JSON spec routes
 * - Service discovery route
 *
 * All routes are public (no authentication).
 */
export async function swaggerService(
  fastify: FastifyInstance,
  options: SwaggerServiceOptions,
): Promise<void> {
  // Register all route groups
  await openapiSpecRoutes(fastify);
  await swaggerUiRoutes(fastify);
  await serviceDiscoveryRoutes(fastify);
}

/**
 * Get the service metadata (base path, name, etc.)
 */
export { swaggerServiceMetadata };
