import { FastifyReply, FastifyRequest } from "fastify";
import type { GetSwaggerUiHttpRequest } from "@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit";
import { swaggerServiceMetadata } from "@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit";

const SCALAR_STANDALONE_CDN =
  "https://cdn.jsdelivr.net/npm/@scalar/api-reference@1.40.5/dist/browser/standalone.js";

/**
 * Extract server URL from request headers.
 * Supports x-forwarded-proto/x-forwarded-host for proxies.
 */
/**
 * Generate HTML for Scalar UI pointing to global OpenAPI spec.
 */
function generateScalarHtml(options: {
  title: string;
  openApiSpecUrl: string;
}): string {
  const { title, openApiSpecUrl } = options;
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    #app {
      height: 100vh;
    }
  </style>
  <script src="${SCALAR_STANDALONE_CDN}"></script>
</head>
<body>
  <div id="app"></div>
  <script>
    document.addEventListener('DOMContentLoaded', function() {
      Scalar.createApiReference('#app', {
        url: '${openApiSpecUrl}',
        theme: 'default',
      });
    });
  </script>
</body>
</html>`;
}

export function createGetSwaggerUiHandler() {
  return async (
    request: FastifyRequest<{ Querystring: GetSwaggerUiHttpRequest }>,
    reply: FastifyReply,
  ) => {
    // Use relative URL so it works behind proxies without needing absolute origin reconstruction
    const openApiSpecUrl = `${swaggerServiceMetadata.basePath}/openapi.json`;
    const html = generateScalarHtml({
      title: "ACMP Connector API Documentation",
      openApiSpecUrl,
    });

    return reply.status(200).type("text/html").send(html);
  };
}
