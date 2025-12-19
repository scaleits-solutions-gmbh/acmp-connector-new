import { sicsApiRequest } from '../utils/sics-api-request';
import { getCreateTargetRequestBody } from '../utils/request-body/create-target-request-body';

/**
 * Parameters for creating a target.
 */
export interface CreateTargetParams {
  /** The session token */
  session: string;
  /** The name of the target to create */
  targetName: string;
}

/**
 * Creates a target in SICS.
 *
 * @param params - The parameters for creating the target
 * @throws Error if the API call fails
 */
export async function createTargetHelperMethod(params: CreateTargetParams): Promise<void> {
  const response = await sicsApiRequest({
    path: '/Target',
    method: 'POST',
    body: JSON.stringify(getCreateTargetRequestBody(params.targetName)),
    session: params.session,
  });

  if (!response.ok) {
    throw new Error(`Failed to create target: ${response.statusText}`);
  }
}
