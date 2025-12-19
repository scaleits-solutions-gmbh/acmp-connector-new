/**
 * Request body for SICS CreateVirtualRouter endpoint.
 */
export interface CreateVirtualRouterRequestBody {
  VirtualRouterName: string;
}

/**
 * Creates the request body for creating a virtual router.
 *
 * @param virtualRouterName - The name of the virtual router to create
 * @returns Create virtual router request body
 */
export function getCreateVirtualRouterRequestBody(virtualRouterName: string): CreateVirtualRouterRequestBody {
  return {
    VirtualRouterName: virtualRouterName,
  };
}
