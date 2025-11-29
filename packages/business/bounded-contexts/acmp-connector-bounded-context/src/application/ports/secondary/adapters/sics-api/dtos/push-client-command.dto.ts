/**
 * Input DTO for pushing a client command to SICS API.
 */
export interface PushClientCommandDto {
  /**
   * The ID of the client command to push.
   */
  clientCommandId: string;

  /**
   * The IDs of the clients to receive the command.
   */
  clientIds: string[];
}

/**
 * Output DTO for push client command result.
 */
export interface PushClientCommandResultDto {
  /**
   * Whether the operation was successful.
   */
  success: boolean;

  /**
   * Optional job ID if the operation created a job.
   */
  jobId?: string;
}

