import { SicsSession } from '../types/sics-session.type';
import { getSicsSessionDuration, getSicsUserCredentials } from '../config';
import { getSessionRequestBody } from '../utils/request-body/session-request-body';
import { sicsApiRequest } from '../utils/sics-api-request';

/**
 * Authenticates with the SICS API and returns a session.
 *
 * @returns A valid SICS session
 * @throws Error if authentication fails
 */
export async function getSessionAdapterMethod(): Promise<SicsSession> {
  const credentials = getSicsUserCredentials();

  const response = await sicsApiRequest({
    path: '/Session',
    method: 'POST',
    body: JSON.stringify(getSessionRequestBody(credentials)),
  });

  if (!response.ok) {
    console.error('SICS session authentication failed:', response.status, response.statusText);
    throw new Error('Failed to authenticate with SICS API');
  }

  const data = await response.json();
  const session = data.Session;

  if (!session) {
    throw new Error('SICS API did not return a session token');
  }

  return {
    session,
    expiresAt: new Date(Date.now() + getSicsSessionDuration()),
  };
}
