import type { FastifyReply, FastifyRequest } from 'fastify';
import type { GetDashboardHttpResponse } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';

function maskApiKey(apiKey: string): string {
  if (!apiKey) return '';
  if (apiKey.length <= 8) return 'sk-••••••••';
  return `${apiKey.slice(0, 6)}••••••••••••`;
}

export function createGetDashboardHandler() {
  return async (_request: FastifyRequest, reply: FastifyReply) => {
    const host = process.env.HOST ?? '0.0.0.0';
    const port = Number(process.env.PORT ?? 3080);
    const publicIp = process.env.PUBLIC_IP ?? '203.0.113.10';
    const apiKey = process.env.API_KEY ?? 'sk-acmp-REPLACE_ME';

    const response: GetDashboardHttpResponse = {
      statusCode: 200,
      body: {
        runtime: {
          version: process.env.npm_package_version ?? '1.0.0',
          environment: process.env.NODE_ENV ?? 'production',
          uptimeMs: Math.floor(process.uptime() * 1000),
        },
        health: {
          status: 'healthy',
          timestamp: new Date().toISOString(),
        },
        server: {
          host,
          port,
          publicIp,
          publicEndpoint: `${publicIp}:${port}`,
          apiKey,
          apiKeyMasked: maskApiKey(apiKey),
        },
        connections: {
          database: {
            status: 'connected',
            latencyMs: 8,
            server: process.env.DB_SERVER ?? 'DE-CLD-WV-SQL01',
            port: Number(process.env.DB_PORT ?? 1433),
            database: process.env.DB_NAME ?? 'ACMP_INTERN',
            user: process.env.DB_USER ?? 'ACMPDBUser',
            encrypt: (process.env.DB_ENCRYPT ?? 'false') === 'true',
            trustCert: (process.env.DB_TRUST_CERT ?? 'true') === 'true',
          },
          sics: {
            status: 'connected',
            latencyMs: 23,
            url: process.env.SICS_API_URL ?? 'http://localhost:3900',
            user: process.env.SICS_USER_USERNAME ?? 'ACMP',
            routingKey: process.env.SICS_ACMP_ROUTING_KEY ?? undefined,
          },
        },
      },
    };

    return reply.status(response.statusCode).send(response.body);
  };
}
