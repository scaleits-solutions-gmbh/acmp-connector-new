import { FastifyReply, FastifyRequest } from "fastify";
import { listAvailableServices } from "@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit";
import type { ListServicesHttpRequest } from "@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit";

export function createListServicesHandler() {
  return async (
    request: FastifyRequest<{ Querystring: ListServicesHttpRequest }>,
    reply: FastifyReply,
  ) => {
    const services = listAvailableServices().map((s) => s.id);

    return reply.status(200).send({
      services,
    });
  };
}
