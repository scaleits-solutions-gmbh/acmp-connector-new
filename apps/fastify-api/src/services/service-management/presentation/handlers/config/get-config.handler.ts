import type { FastifyReply, FastifyRequest } from 'fastify';
import type { GetConfigHttpResponse } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';

function maskApiKey(apiKey: string): string {
  if (!apiKey) return '';
  if (apiKey.length <= 8) return 'sk-••••••••';
  return `${apiKey.slice(0, 6)}••••••••••••`;
}

export function createGetConfigHandler() {
  return async (_request: FastifyRequest, reply: FastifyReply) => {
    const apiKey = process.env.API_KEY ?? '';

    const response: GetConfigHttpResponse = {
      statusCode: 200,
      body: {
        HOST: process.env.HOST ?? '0.0.0.0',
        PORT: process.env.PORT ?? '3080',
        PUBLIC_IP: process.env.PUBLIC_IP ?? '203.0.113.10',

        API_KEY_MASKED: maskApiKey(apiKey),
        API_KEY_CONFIGURED: Boolean(apiKey),

        DB_SERVER: process.env.DB_SERVER ?? 'DE-CLD-WV-SQL01',
        DB_NAME: process.env.DB_NAME ?? 'ACMP_INTERN',
        DB_USER: process.env.DB_USER ?? 'ACMPDBUser',
        DB_PORT: process.env.DB_PORT ?? '1433',
        DB_ENCRYPT: (process.env.DB_ENCRYPT ?? 'false') === 'true' ? 'true' : 'false',
        DB_TRUST_CERT:
          (process.env.DB_TRUST_CERT ?? 'true') === 'true' ? 'true' : 'false',
        DB_PASSWORD_CONFIGURED: Boolean(process.env.DB_PASSWORD),

        SICS_API_URL: process.env.SICS_API_URL ?? 'http://localhost:3900',
        SICS_USER_USERNAME: process.env.SICS_USER_USERNAME ?? 'ACMP',
        SICS_PASSWORD_CONFIGURED: Boolean(process.env.SICS_USER_PASSWORD),
        SICS_ACMP_ROUTING_KEY: process.env.SICS_ACMP_ROUTING_KEY ?? '',
      },
    };

    return reply.status(response.statusCode).send(response.body);
  };
}
