import { sicsApiRequest } from '../utils/sics-api-request';
import { getCreateVirtualRouterRequestBody } from '../utils/request-body/create-virtual-router-request-body';

/**
 * Parameters for creating a virtual router.
 */
export interface CreateVirtualRouterParams {
  /** The session token */
  session: string;
  /** The name of the virtual router to create */
  virtualRouterName: string;
}

/**
 * Creates a virtual router in SICS.
 *
 * @param params - The parameters for creating the virtual router
 * @throws Error if the API call fails
 */
export async function createVirtualRouterHelperMethod(params: CreateVirtualRouterParams): Promise<void> {
  const response = await sicsApiRequest({
    path: '/VirtualRouter',
    method: 'POST',
    body: JSON.stringify(getCreateVirtualRouterRequestBody(params.virtualRouterName)),
    session: params.session,
  });

  if (!response.ok) {
    throw new Error(`Failed to create virtual router: ${response.statusText}`);
  }
}
