import { z } from 'zod';

/**
 * SICS API configuration from environment variables.
 */
export interface SicsApiConfig {
  apiUrl: string;
  username: string;
  password: string;
  acmpRoutingKey: string;
  acmpVirtualRouter: string;
  sessionDurationMs: number;
  tlsInsecure: boolean;
}

/**
 * Gets the SICS API URL from environment.
 * @throws Error if SICS_API_URL is not set
 */
export function getSicsApiUrl(): string {
  const value = process.env.SICS_API_URL;
  if (!value) throw new Error('SICS_API_URL is not set');
  return z.string().url().parse(value);
}

/**
 * Gets the SICS user credentials from environment.
 * @throws Error if credentials are not set
 */
export function getSicsUserCredentials(): { username: string; password: string } {
  const username = process.env.SICS_USER_USERNAME;
  const password = process.env.SICS_USER_PASSWORD;

  if (!username && !password) throw new Error('SICS_USER_USERNAME and SICS_USER_PASSWORD are not set');
  if (!username) throw new Error('SICS_USER_USERNAME is not set');
  if (!password) throw new Error('SICS_USER_PASSWORD is not set');

  return { username, password };
}

/**
 * Gets the SICS session duration in milliseconds.
 * Defaults to 60 seconds if not set.
 */
export function getSicsSessionDuration(): number {
  const value = process.env.SICS_SESSION_DURATION_MS;
  if (!value) return 60_000;
  return z.coerce.number().int().positive().parse(value);
}

/**
 * Gets whether TLS certificate verification should be disabled.
 * Defaults to false (verification enabled).
 */
export function getSicsTlsInsecure(): boolean {
  const value = process.env.SICS_TLS_INSECURE;
  if (!value) return false;
  return value === 'true' || value === '1';
}

/**
 * Gets the ACMP routing key for SICS publish operations.
 * @throws Error if SICS_ACMP_ROUTING_KEY is not set
 */
export function getSicsAcmpRoutingKey(): string {
  const value = process.env.SICS_ACMP_ROUTING_KEY;
  if (!value) throw new Error('SICS_ACMP_ROUTING_KEY is not set');
  return z.string().min(1).parse(value);
}

/**
 * Gets the ACMP virtual router for SICS publish operations.
 * @throws Error if SICS_ACMP_VIRTUAL_ROUTER is not set
 */
export function getSicsAcmpVirtualRouter(): string {
  const value = process.env.SICS_ACMP_VIRTUAL_ROUTER;
  if (!value) throw new Error('SICS_ACMP_VIRTUAL_ROUTER is not set');
  return z.string().min(1).parse(value);
}

/**
 * Gets the complete SICS API configuration.
 * @throws Error if any required configuration is missing
 */
export function getSicsApiConfig(): SicsApiConfig {
  const credentials = getSicsUserCredentials();
  return {
    apiUrl: getSicsApiUrl(),
    username: credentials.username,
    password: credentials.password,
    acmpRoutingKey: getSicsAcmpRoutingKey(),
    acmpVirtualRouter: getSicsAcmpVirtualRouter(),
    sessionDurationMs: getSicsSessionDuration(),
    tlsInsecure: getSicsTlsInsecure(),
  };
}
