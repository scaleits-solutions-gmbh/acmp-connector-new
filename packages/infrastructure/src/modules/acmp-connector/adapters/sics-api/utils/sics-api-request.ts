import { getSicsApiUrl, getSicsTlsInsecure } from '../config';

/**
 * Parameters for making a SICS API request.
 */
export interface SicsApiRequestParams {
  /** The API endpoint path (e.g., '/Session', '/Publish') */
  path: string;
  /** HTTP method */
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  /** Request body as JSON string */
  body?: string;
  /** Session token for authenticated requests */
  session?: string;
}

/**
 * Makes an HTTP request to the SICS API.
 *
 * @param params - Request parameters
 * @returns The fetch Response
 */
export async function sicsApiRequest({ path, method, body, session }: SicsApiRequestParams): Promise<Response> {
  // Handle TLS insecure mode for local testing
  const insecure = getSicsTlsInsecure();
  if (insecure) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  }

  const url = `${getSicsApiUrl()}${path}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (session) {
    headers['X-SICS-SESSION'] = session;
  }

  return fetch(url, {
    method,
    headers,
    body,
  });
}
