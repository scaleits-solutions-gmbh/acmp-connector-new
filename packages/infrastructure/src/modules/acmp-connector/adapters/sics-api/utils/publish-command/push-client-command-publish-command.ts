import { createBasePublishCommand } from './base-publish-command';

/**
 * Parameters for creating a push client command.
 */
export interface PushClientCommandPublishParams {
  /** The target client ID */
  clientId: string;
  /** The client command ID to execute */
  clientCommandId: string;
}

/**
 * Creates a publish command for pushing a client command.
 *
 * @param params - The command parameters
 * @returns The publish command object
 */
export function getPushClientCommandPublishCommand(params: PushClientCommandPublishParams): object {
  return createBasePublishCommand('ExecuteClientCommand', {
    ClientId: params.clientId,
    ClientCommandId: params.clientCommandId,
  });
}
