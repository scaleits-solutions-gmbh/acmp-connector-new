import { FindRolloutTemplateByIdIn } from '@repo/business/bounded-contexts/acmp-connector-bounded-context';
import { GetRolloutTemplateByIdHttpRequest } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';

export function findRolloutTemplateByIdHttpRequestMapper(request: GetRolloutTemplateByIdHttpRequest): FindRolloutTemplateByIdIn {
  return FindRolloutTemplateByIdIn.create({
    id: request.pathParams.id,
  });
}
