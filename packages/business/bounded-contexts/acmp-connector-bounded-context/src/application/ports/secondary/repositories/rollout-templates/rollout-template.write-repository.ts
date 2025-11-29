
/**
 * Write repository for pushing rollout templates via SICS API.
 */
export interface RolloutTemplateWriteRepositorySecondaryPort {
  /**
   * Push a rollout template to selected clients via SICS API
   */
  pushRolloutTemplate(rolloutTemplateId: string, clientIds: string[]): Promise<{ success: boolean; jobId?: string }>;
}
