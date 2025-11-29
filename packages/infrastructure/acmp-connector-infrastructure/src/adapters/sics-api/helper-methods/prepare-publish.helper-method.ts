import { randomUUID } from 'crypto';
import { createVirtualRouterHelperMethod } from './create-virtual-router.helper-method';
import { createTargetHelperMethod } from './create-target.helper-method';

/**
 * Parameters for preparing a publish operation.
 */
export interface PreparePublishParams {
  /** The session token */
  session: string;
}

/**
 * Prepares a publish operation by creating a virtual router and target.
 *
 * @param params - The parameters for preparing the publish
 * @returns The unique publish identifier
 */
export async function preparePublishHelperMethod(params: PreparePublishParams): Promise<string> {
  const publishIdentifier = randomUUID();

  await createVirtualRouterHelperMethod({
    session: params.session,
    virtualRouterName: publishIdentifier,
  });

  await createTargetHelperMethod({
    session: params.session,
    targetName: publishIdentifier,
  });

  return publishIdentifier;
}

