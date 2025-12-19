/**
 * Base structure for SICS publish commands.
 */
export interface BasePublishCommand {
  Command: string;
  Version: string;
  Params: object;
}

/**
 * Creates a base publish command structure.
 *
 * @param command - The command name
 * @param params - The command parameters
 * @param version - The command version (default: '1.0')
 * @returns Base publish command
 */
export function createBasePublishCommand(command: string, params: object, version = '1.0'): BasePublishCommand {
  return {
    Command: command,
    Version: version,
    Params: params,
  };
}
