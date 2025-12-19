import { ClientCommandWriteRepositorySecondaryPort } from '@repo/modules/acmp-connector';
import { getSicsApiAdapter } from 'acmp-connector/adapters/sics-api';
import { BaseSpi } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit/common';

/**
 * Write repository implementation for client commands using SICS API.
 */
export class SicsApiClientCommandWriteRepository extends BaseSpi implements ClientCommandWriteRepositorySecondaryPort {
  public constructor() {
    super();
  }
  /**
   * Push a client command to selected clients via SICS API.
   *
   * @param commandId - The client command ID to push
   * @param clientIds - The target client IDs
   * @returns Result with success status and optional job ID
   */
  async pushClientCommand(commandId: string, clientIds: string[]): Promise<{ success: boolean; jobId?: string }> {
    try {
      const adapter = getSicsApiAdapter();
      await adapter.pushClientCommand({
        clientCommandId: commandId,
        clientIds,
      });
      return { success: true };
    } catch (error) {
      console.error('Failed to push client command via SICS API:', error);
      return { success: false };
    }
  }
}
