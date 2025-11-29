import { RolloutTemplateWriteRepositorySecondaryPort } from '@repo/business/bounded-contexts/acmp-connector-bounded-context';
import { getSicsApiAdapter } from '@/adapters/sics-api';

/**
 * Write repository implementation for rollout templates using SICS API.
 */
export class SicsApiRolloutTemplateWriteRepository implements RolloutTemplateWriteRepositorySecondaryPort {
  /**
   * Push a rollout template to selected clients via SICS API.
   *
   * @param rolloutTemplateId - The rollout template ID to push
   * @param clientIds - The target client IDs
   * @returns Result with success status and optional job ID
   */
  async pushRolloutTemplate(rolloutTemplateId: string, clientIds: string[]): Promise<{ success: boolean; jobId?: string }> {
    try {
      const adapter = getSicsApiAdapter();
      await adapter.pushRolloutTemplate({
        rolloutTemplateId,
        clientIds,
      });
      return { success: true };
    } catch (error) {
      console.error('Failed to push rollout template via SICS API:', error);
      return { success: false };
    }
  }
}

