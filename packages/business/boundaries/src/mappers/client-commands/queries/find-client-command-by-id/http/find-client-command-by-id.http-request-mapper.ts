import { FindClientCommandByIdIn } from '@repo/business/bounded-contexts/acmp-connector-bounded-context';
import { GetClientCommandByIdHttpRequest } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';

export function findClientCommandByIdHttpRequestMapper(request: GetClientCommandByIdHttpRequest): FindClientCommandByIdIn {
  return FindClientCommandByIdIn.create({
    id: request.pathParams.id,
  });
}
