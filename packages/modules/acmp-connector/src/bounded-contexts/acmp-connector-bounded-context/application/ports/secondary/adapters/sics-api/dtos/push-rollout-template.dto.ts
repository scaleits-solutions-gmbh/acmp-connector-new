/**
 * Input DTO for pushing a rollout template to SICS API.
 */
export interface PushRolloutTemplateDto {
  /**
   * The ID of the rollout template to push.
   */
  rolloutTemplateId: string;

  /**
   * The IDs of the clients to receive the rollout.
   */
  clientIds: string[];
}

/**
 * Output DTO for push rollout template result.
 */
export interface PushRolloutTemplateResultDto {
  /**
   * Whether the operation was successful.
   */
  success: boolean;

  /**
   * Optional job ID if the operation created a job.
   */
  jobId?: string;
}
