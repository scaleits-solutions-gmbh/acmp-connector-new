
/**
 * Write repository for pushing client commands via SICS API.
 */
export interface ClientCommandWriteRepositorySecondaryPort {
  /**
   * Push a client command to selected clients via SICS API
   */
  pushClientCommand(commandId: string, clientIds: string[]): Promise<{ success: boolean; jobId?: string }>;
}
