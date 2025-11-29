/**
 * Request body for SICS Session endpoint.
 */
export interface SessionRequestBody {
  UserName: string;
  Password: string;
}

/**
 * Creates the request body for SICS session authentication.
 *
 * @param credentials - User credentials
 * @returns Session request body
 */
export function getSessionRequestBody(credentials: { username: string; password: string }): SessionRequestBody {
  return {
    UserName: credentials.username,
    Password: credentials.password,
  };
}

