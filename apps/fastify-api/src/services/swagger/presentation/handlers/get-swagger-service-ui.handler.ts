import { FastifyReply, FastifyRequest } from "fastify";
import {
  listAvailableServices,
  swaggerServiceMetadata,
} from "@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit";
import type { GetSwaggerServiceUiHttpRequest } from "@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit";
import { NotFoundException } from "@scaleits-solutions-gmbh/org-lib-backend-common-kit/frameworks/fastify";

const SCALAR_STANDALONE_CDN =
  "https://cdn.jsdelivr.net/npm/@scalar/api-reference@1.40.5/dist/browser/standalone.js";

/**
 * Generate HTML for Scalar UI pointing to service-specific OpenAPI spec.
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

export function createGetSwaggerServiceUiHandler() {
  return async (
    request: FastifyRequest<{
      Params: GetSwaggerServiceUiHttpRequest["pathParams"];
    }>,
    reply: FastifyReply,
  ) => {
    const { serviceId } = request.params;

    // Validate serviceId exists
    const availableServices = listAvailableServices().map((s) => s.id);
    if (!availableServices.includes(serviceId)) {
      throw new NotFoundException({
        message: `Service '${serviceId}' not found`,
        errorCode: "SWAGGER_UI_SERVICE_NOT_FOUND",
        errorItems: [
          {
            item: "availableServices",
            message: availableServices.join(", "),
          },
        ],
      });
    }

    // Use relative URL so it works behind proxies without needing absolute origin reconstruction
    const openApiSpecUrl = `${swaggerServiceMetadata.basePath}/openapi/${serviceId}`;
    const html = generateScalarHtml({
      title: `${serviceId} - ACMP Connector API Documentation`,
      openApiSpecUrl,
    });

    return reply.status(200).type("text/html").send(html);
  };
}
