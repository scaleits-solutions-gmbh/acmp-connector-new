import { createBasePublishCommand } from './base-publish-command';

/**
 * Parameters for creating a push rollout template command.
 */
export interface PushRolloutTemplatePublishParams {
  /** The target client ID */
  clientId: string;
  /** The rollout template ID to execute */
  rolloutTemplateId: string;
}

/**
 * Creates a publish command for pushing a rollout template.
 *
 * @param params - The command parameters
 * @returns The publish command object
 */
export function getPushRolloutTemplatePublishCommand(params: PushRolloutTemplatePublishParams): object {
  return createBasePublishCommand('ExecuteRolloutTemplate', {
    ClientId: params.clientId,
    RolloutTemplateId: params.rolloutTemplateId,
  });
}

