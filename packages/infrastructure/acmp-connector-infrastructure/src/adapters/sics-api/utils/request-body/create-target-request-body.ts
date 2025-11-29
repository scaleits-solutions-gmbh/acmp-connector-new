/**
 * Request body for SICS CreateTarget endpoint.
 */
export interface CreateTargetRequestBody {
  TargetName: string;
}

/**
 * Creates the request body for creating a target.
 *
 * @param targetName - The name of the target to create
 * @returns Create target request body
 */
export function getCreateTargetRequestBody(targetName: string): CreateTargetRequestBody {
  return {
    TargetName: targetName,
  };
}

