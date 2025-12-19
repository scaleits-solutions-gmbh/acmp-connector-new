import Fastify from "fastify";
import cors from "@fastify/cors";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import {
  globalExceptionHandlerPlugin,
  localOnlyAuthPlugin,
  zodSerializerCompiler,
  zodValidatorCompiler,
} from "@scaleits-solutions-gmbh/org-lib-backend-common-kit/frameworks/fastify";
import {
  acmpConnectorServiceMetadata,
  serviceManagementServiceMetadata,
  swaggerServiceMetadata,
} from "@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit";
import type { UseCases } from "@/bootstrap/use-cases.bootstrap";
import { acmpConnectorService } from "@/services/acmp-connector/acmp-connector.service";
import { swaggerService } from "@/services/swagger/swagger.service";
import { adminPanelService } from "@/services/admin-panel/admin-panel.service";
import { serviceManagementService } from "@/services/service-management/service-management.service";

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

  // Register global plugins
  await fastify.register(globalExceptionHandlerPlugin, {
    // Keep safe defaults; override per app if needed
    exposeInternalErrors: process.env.NODE_ENV !== "production",
  });

  await fastify.register(cors, {
    origin: true,
  });

  // Lazily import the default use-cases only when needed.
  // This allows tests to inject fakes without loading the full DI graph.
  const useCases =
    options.useCases ??
    (await import("@/bootstrap/use-cases.bootstrap")).bootstrapUseCases;

  // ─────────────────────────────────────────────────────────────────────────────
  // Services
  // ─────────────────────────────────────────────────────────────────────────────

  // Swagger Service (/swagger) - Public, no auth required
  await fastify.register(swaggerService, {
    prefix: swaggerServiceMetadata.basePath,
  });

  // ACMP Connector Service (/api)
  await fastify.register(acmpConnectorService, {
    prefix: acmpConnectorServiceMetadata.basePath,
    useCases,
  });

  // Local-only auth for Admin Panel (restricts access to localhost only)
  await fastify.register(localOnlyAuthPlugin, {
    protectedRoutes: [
      "/admin-panel",
      "/admin-panel/*",
      "/service-management",
      "/service-management/*",
    ],
    forbiddenMessage: "Admin panel is only accessible from the local machine",
  });

  // Admin UI Service (/admin-panel)
  await fastify.register(adminPanelService, {
    prefix: "/admin-panel",
  });

  // Service Management Service (/service-management) - local-only
  await fastify.register(serviceManagementService, {
    prefix: serviceManagementServiceMetadata.basePath,
  });

  // Health check (legacy, non-prefixed for infrastructure probes)
  fastify.get("/health", async () => ({
    status: "ok",
    timestamp: new Date().toISOString(),
  }));

  return fastify;
}
