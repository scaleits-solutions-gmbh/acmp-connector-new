import { sicsApiRequest } from '../utils/sics-api-request';

/**
 * Parameters for cleaning up a publish operation.
 */
export interface CleanUpPublishParams {
  /** The session token */
  session: string;
  /** The publish identifier to clean up */
  publishIdentifier: string;
}

/**
 * Cleans up after a publish operation by deleting the virtual router and target.
 *
 * This is a fire-and-forget operation that doesn't throw on failure.
 *
 * @param params - The parameters for cleaning up
 */
export async function cleanUpPublishHelperMethod(params: CleanUpPublishParams): Promise<void> {
  try {
    // Delete virtual router
    await sicsApiRequest({
      path: `/VirtualRouter/${params.publishIdentifier}`,
      method: 'DELETE',
      session: params.session,
    });
  } catch {
    // Fire and forget - ignore errors
  }

  try {
    // Delete target
    await sicsApiRequest({
      path: `/Target/${params.publishIdentifier}`,
      method: 'DELETE',
      session: params.session,
    });
  } catch {
    // Fire and forget - ignore errors
  }
}
