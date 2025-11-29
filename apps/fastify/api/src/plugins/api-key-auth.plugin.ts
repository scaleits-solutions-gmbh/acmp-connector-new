import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import fp from 'fastify-plugin';
import { timingSafeEqual } from 'crypto';

export interface ApiKeyAuthOptions {
  /**
   * Header name to check for the API key.
   * @default 'x-api-key'
   */
  header?: string;

  /**
   * Routes to exclude from API key validation (e.g., health checks).
   * Supports exact paths or prefix matching with '*'.
   * @example ['/health', '/api/public/*']
   */
  excludeRoutes?: string[];

  /**
   * Custom error message for unauthorized requests.
   */
  unauthorizedMessage?: string;
}

/**
 * Compares two strings in constant time to prevent timing attacks.
 */
function secureCompare(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }
  
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  
  return timingSafeEqual(bufA, bufB);
}

/**
 * Checks if a route should be excluded from API key validation.
 */
function isExcludedRoute(url: string, excludeRoutes: string[]): boolean {
  for (const route of excludeRoutes) {
    if (route.endsWith('*')) {
      const prefix = route.slice(0, -1);
      if (url.startsWith(prefix)) {
        return true;
      }
    } else if (url === route) {
      return true;
    }
  }
  return false;
}

/**
 * API Key Authentication Plugin for Fastify.
 * 
 * Validates requests against the API_KEY environment variable.
 * 
 * @example
 * ```ts
 * // Register the plugin
 * await fastify.register(apiKeyAuthPlugin, {
 *   excludeRoutes: ['/health'],
 * });
 * ```
 */
async function apiKeyAuth(
  fastify: FastifyInstance,
  options: ApiKeyAuthOptions,
): Promise<void> {
  const {
    header = 'x-api-key',
    excludeRoutes = [],
    unauthorizedMessage = 'Unauthorized: Invalid or missing API key',
  } = options;

  const validApiKey = process.env.API_KEY;

  if (!validApiKey) {
    fastify.log.warn('API_KEY environment variable is not set. API key validation will be skipped.');
  }

  fastify.addHook('onRequest', async (request: FastifyRequest, reply: FastifyReply) => {
    // Skip validation if API_KEY is not configured
    if (!validApiKey) {
      return;
    }

    // Skip excluded routes
    if (isExcludedRoute(request.url, excludeRoutes)) {
      return;
    }

    const providedKey = request.headers[header.toLowerCase()] as string | undefined;

    if (!providedKey) {
      return reply.status(401).send({
        statusCode: 401,
        error: 'Unauthorized',
        message: unauthorizedMessage,
      });
    }

    // Use timing-safe comparison to prevent timing attacks
    if (!secureCompare(providedKey, validApiKey)) {
      return reply.status(401).send({
        statusCode: 401,
        error: 'Unauthorized',
        message: unauthorizedMessage,
      });
    }
  });
}

export const apiKeyAuthPlugin = fp(apiKeyAuth, {
  name: 'api-key-auth',
  fastify: '5.x',
});

