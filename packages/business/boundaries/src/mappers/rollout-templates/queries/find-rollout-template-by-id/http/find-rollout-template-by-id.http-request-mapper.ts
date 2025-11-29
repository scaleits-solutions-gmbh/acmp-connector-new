import { FindRolloutTemplateByIdIn } from '@repo/business/bounded-contexts/acmp-connector-bounded-context';
import { GetRolloutByIdHttpRequest } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';

export function findRolloutTemplateByIdHttpRequestMapper(request: GetRolloutByIdHttpRequest): FindRolloutTemplateByIdIn {
  return FindRolloutTemplateByIdIn.create({
    id: request.pathParams.id,
  });
}
