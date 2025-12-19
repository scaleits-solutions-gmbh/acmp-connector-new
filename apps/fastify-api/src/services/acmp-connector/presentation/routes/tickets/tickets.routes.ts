import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import {
  getTicketsHttpMetadata,
  getTicketsHttpRequestSchema,
  getTicketByIdHttpMetadata,
  getTicketByIdHttpRequestSchema,
} from "@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit";
import type {
  FindPaginatedTicketsQueryPrimaryPort,
  FindTicketByIdQueryPrimaryPort,
} from "@repo/modules/acmp-connector";
import {
  buildFastifySchema,
  toFastifyPath,
} from "@scaleits-solutions-gmbh/org-lib-backend-common-kit/frameworks/fastify";
import { createFindPaginatedTicketsHandler } from "@/services/acmp-connector/presentation/handlers/tickets/find-paginated-tickets.handler";
import { createFindTicketByIdHandler } from "@/services/acmp-connector/presentation/handlers/tickets/find-ticket-by-id.handler";

export async function ticketsRoutes(
  fastify: FastifyInstance,
  findPaginatedTicketsQuery: FindPaginatedTicketsQueryPrimaryPort,
  findTicketByIdQuery: FindTicketByIdQueryPrimaryPort,
) {
  fastify.withTypeProvider<ZodTypeProvider>().route({
    method: getTicketsHttpMetadata.method,
    url: toFastifyPath(getTicketsHttpMetadata.path),
    schema: buildFastifySchema(getTicketsHttpRequestSchema),
    handler: createFindPaginatedTicketsHandler(findPaginatedTicketsQuery),
  });

  fastify.withTypeProvider<ZodTypeProvider>().route({
    method: getTicketByIdHttpMetadata.method,
    url: toFastifyPath(getTicketByIdHttpMetadata.path),
    schema: buildFastifySchema(getTicketByIdHttpRequestSchema),
    handler: createFindTicketByIdHandler(findTicketByIdQuery),
  });
}
