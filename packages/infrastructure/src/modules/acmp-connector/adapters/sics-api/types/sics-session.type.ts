/**
 * Represents a SICS API session.
 */
export interface SicsSession {
  /** The session token */
  session: string;
  /** When the session expires */
  expiresAt: Date;
}
