import { FindTicketByIdIn } from '@repo/business/bounded-contexts/acmp-connector-bounded-context';
import { GetTicketByIdHttpRequest } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';

export function findTicketByIdHttpRequestMapper(request: GetTicketByIdHttpRequest): FindTicketByIdIn {
  return FindTicketByIdIn.create({
    id: request.pathParams.id,
  });
}
