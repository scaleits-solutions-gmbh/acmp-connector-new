import { FastifyRequest } from 'fastify';

/**
 * Maps a Fastify request to our HTTP contract request format.
 * 
 * Fastify uses `params` and `query`, while our contracts use `pathParams` and `queryParams`.
 * 
 * @example
 * // For a request with path params and query params
 * const request = mapFastifyRequest<GetClientByIdHttpRequest>(fastifyRequest);
 * // request.pathParams.id is now accessible
 * // request.queryParams.page is now accessible
 */
export function mapFastifyRequest<T extends { pathParams?: unknown; queryParams?: unknown }>(
  request: FastifyRequest,
): T {
  return {
    pathParams: request.params,
    queryParams: request.query,
  } as T;
}

/**
 * Maps a Fastify request with only query params to our HTTP contract request format.
 * 
 * @example
 * const request = mapFastifyQueryRequest<GetClientsHttpRequest>(fastifyRequest);
 */
export function mapFastifyQueryRequest<T extends { queryParams?: unknown }>(
  request: FastifyRequest,
): T {
  return {
    queryParams: request.query,
  } as T;
}

/**
 * Maps a Fastify request with only path params to our HTTP contract request format.
 * 
 * @example
 * const request = mapFastifyPathRequest<GetClientByIdHttpRequest>(fastifyRequest);
 */
export function mapFastifyPathRequest<T extends { pathParams?: unknown }>(
  request: FastifyRequest,
): T {
  return {
    pathParams: request.params,
  } as T;
}

