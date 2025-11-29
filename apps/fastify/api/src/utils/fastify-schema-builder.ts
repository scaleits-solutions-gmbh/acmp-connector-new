import { z } from 'zod';

type FastifyRouteSchema = {
  params?: z.ZodTypeAny;
  querystring?: z.ZodTypeAny;
  body?: z.ZodTypeAny;
  headers?: z.ZodTypeAny;
};

/**
 * Builds a Fastify route schema from an HTTP request schema.
 * Automatically maps contract schema fields to Fastify's expected schema format:
 * - pathParams → params
 * - queryParams → querystring
 * - body → body
 * - headers → headers
 *
 * @example
 * ```ts
 * fastify.route({
 *   method: 'GET',
 *   url: toFastifyPath('/clients/{id}'),
 *   schema: buildFastifySchema(getClientByIdHttpRequestSchema),
 *   handler: ...
 * });
 * ```
 */
export function buildFastifySchema<T extends z.ZodObject<z.ZodRawShape>>(
  requestSchema: T,
): FastifyRouteSchema {
  const shape = requestSchema.shape;
  const schema: FastifyRouteSchema = {};

  if ('pathParams' in shape && shape.pathParams) {
    schema.params = shape.pathParams as z.ZodTypeAny;
  }

  if ('queryParams' in shape && shape.queryParams) {
    schema.querystring = shape.queryParams as z.ZodTypeAny;
  }

  if ('body' in shape && shape.body) {
    schema.body = shape.body as z.ZodTypeAny;
  }

  if ('headers' in shape && shape.headers) {
    schema.headers = shape.headers as z.ZodTypeAny;
  }

  return schema;
}

/**
 * Converts OpenAPI-style path parameters to Fastify format.
 * 
 * OpenAPI uses `{param}` syntax, Fastify uses `:param` syntax.
 * 
 * @example
 * toFastifyPath('/clients/{id}')           // → '/clients/:id'
 * toFastifyPath('/clients/{clientId}/hard-drives')  // → '/clients/:clientId/hard-drives'
 * toFastifyPath('/clients/:id')            // → '/clients/:id' (already Fastify format, unchanged)
 */
export function toFastifyPath(path: string): string {
  return path.replace(/\{([^}]+)\}/g, ':$1');
}

