import { getSicsAcmpRoutingKey, getSicsAcmpVirtualRouter } from '../config';
import { preparePublishHelperMethod } from '../helper-methods/prepare-publish.helper-method';
import { sicsApiRequest } from '../utils/sics-api-request';
import { getPublishRequestBody } from '../utils/request-body/publish-request-body';
import { getPushClientCommandPublishCommand } from '../utils/publish-command/push-client-command-publish-command';

/**
 * Parameters for pushing a client command.
 */
export interface PushClientCommandParams {
  /** The client command ID to execute */
  clientCommandId: string;
  /** The target client IDs */
  clientIds: string[];
}

/**
 * Pushes a client command to selected clients via SICS.
 *
 * @param params - The command parameters
 * @param session - The SICS session token
 */
export async function pushClientCommandAdapterMethod(params: PushClientCommandParams, session: string): Promise<void> {
  const publishIdentifier = await preparePublishHelperMethod({ session });

  for (const clientId of params.clientIds) {
    await sicsApiRequest({
      path: '/Publish',
      method: 'POST',
      body: JSON.stringify(
        getPublishRequestBody({
          command: getPushClientCommandPublishCommand({
            clientId,
            clientCommandId: params.clientCommandId,
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
