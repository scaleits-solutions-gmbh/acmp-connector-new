import { PushClientCommandDto, PushClientCommandResultDto, PushRolloutTemplateDto, PushRolloutTemplateResultDto } from './dtos';

/**
 * Secondary port for communicating with the SICS external API.
 *
 * This adapter is responsible for pushing commands and rollout templates
 * to ACMP clients via the SICS messaging system.
 */
export interface SicsApiAdapterSecondaryPort {
  /**
   * Push a client command to selected clients via SICS.
   *
   * @param params - The command ID and target client IDs
   * @returns Result indicating success and optional job ID
   */
  pushClientCommand(params: PushClientCommandDto): Promise<PushClientCommandResultDto>;

  /**
   * Push a rollout template to selected clients via SICS.
   *
   * @param params - The rollout template ID and target client IDs
   * @returns Result indicating success and optional job ID
   */
  pushRolloutTemplate(params: PushRolloutTemplateDto): Promise<PushRolloutTemplateResultDto>;
}
