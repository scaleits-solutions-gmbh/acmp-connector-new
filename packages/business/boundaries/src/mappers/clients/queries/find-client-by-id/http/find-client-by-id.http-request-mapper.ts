import { FindClientByIdIn } from '@repo/business/bounded-contexts/acmp-connector-bounded-context';
import { GetClientByIdHttpRequest } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';

export function findClientByIdHttpRequestMapper(request: GetClientByIdHttpRequest): FindClientByIdIn {
  return FindClientByIdIn.create({
    id: request.pathParams.id,
  });
}
