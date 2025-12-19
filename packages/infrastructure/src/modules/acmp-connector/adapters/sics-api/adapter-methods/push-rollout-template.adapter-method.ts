import { getSicsAcmpRoutingKey, getSicsAcmpVirtualRouter } from '../config';
import { preparePublishHelperMethod } from '../helper-methods/prepare-publish.helper-method';
import { sicsApiRequest } from '../utils/sics-api-request';
import { getPublishRequestBody } from '../utils/request-body/publish-request-body';
import { getPushRolloutTemplatePublishCommand } from '../utils/publish-command/push-rollout-template-publish-command';

/**
 * Parameters for pushing a rollout template.
 */
export interface PushRolloutTemplateParams {
  /** The rollout template ID to execute */
  rolloutTemplateId: string;
  /** The target client IDs */
  clientIds: string[];
}

/**
 * Pushes a rollout template to selected clients via SICS.
 *
 * @param params - The rollout template parameters
 * @param session - The SICS session token
 */
export async function pushRolloutTemplateAdapterMethod(params: PushRolloutTemplateParams, session: string): Promise<void> {
  const publishIdentifier = await preparePublishHelperMethod({ session });

  for (const clientId of params.clientIds) {
    await sicsApiRequest({
      path: '/Publish',
      method: 'POST',
      body: JSON.stringify(
        getPublishRequestBody({
          command: getPushRolloutTemplatePublishCommand({
            clientId,
            rolloutTemplateId: params.rolloutTemplateId,
          }),
          acmpRoutingKey: getSicsAcmpRoutingKey(),
          acmpVirtualRouter: getSicsAcmpVirtualRouter(),
          publishIdentifier,
        }),
      ),
      session,
    });
  }

  // Note: cleanUpPublish is omitted here as in the original (fire and forget)
}
