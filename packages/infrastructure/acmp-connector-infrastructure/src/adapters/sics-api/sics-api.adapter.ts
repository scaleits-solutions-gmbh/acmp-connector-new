import { SicsSession } from './types/sics-session.type';
import { getSessionAdapterMethod } from './adapter-methods/get-session.adapter-method';
import { pushClientCommandAdapterMethod, PushClientCommandParams } from './adapter-methods/push-client-command.adapter-method';
import { pushRolloutTemplateAdapterMethod, PushRolloutTemplateParams } from './adapter-methods/push-rollout-template.adapter-method';

/**
 * SICS API Adapter
 *
 * Manages authentication sessions and provides methods for
 * interacting with the SICS messaging system.
 */
export class SicsApiAdapter {
  private session?: SicsSession;

  /** Session skew in milliseconds to refresh before actual expiry */
  private readonly SESSION_SKEW_MS = 10_000;

  /**
   * Gets a valid session, refreshing if necessary.
   *
   * @returns A valid SICS session
   */
  private async getValidSession(): Promise<SicsSession> {
    const now = Date.now();
    const expiry = this.session?.expiresAt?.getTime?.() ?? 0;
    const isValid = this.session && expiry - this.SESSION_SKEW_MS > now;

    if (isValid && this.session) {
      return this.session;
    }

    const freshSession = await getSessionAdapterMethod();
    this.session = freshSession;
    return this.session;
  }

  /**
   * Pushes a client command to selected clients.
   *
   * @param params - The command parameters
   */
  async pushClientCommand(params: PushClientCommandParams): Promise<void> {
    const session = await this.getValidSession();
    return pushClientCommandAdapterMethod(params, session.session);
  }

  /**
   * Pushes a rollout template to selected clients.
   *
   * @param params - The rollout template parameters
   */
  async pushRolloutTemplate(params: PushRolloutTemplateParams): Promise<void> {
    const session = await this.getValidSession();
    return pushRolloutTemplateAdapterMethod(params, session.session);
  }
}

// Singleton instance for use across the application
let sicsApiAdapterInstance: SicsApiAdapter | null = null;

/**
 * Gets the singleton SICS API adapter instance.
 *
 * @returns The SICS API adapter
 */
export function getSicsApiAdapter(): SicsApiAdapter {
  if (!sicsApiAdapterInstance) {
    sicsApiAdapterInstance = new SicsApiAdapter();
  }
  return sicsApiAdapterInstance;
}

