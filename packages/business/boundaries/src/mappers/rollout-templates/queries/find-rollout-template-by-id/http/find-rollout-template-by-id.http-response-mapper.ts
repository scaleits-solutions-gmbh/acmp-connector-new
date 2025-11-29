import { FindRolloutTemplateByIdOut } from '@repo/business/bounded-contexts/acmp-connector-bounded-context';
import { GetRolloutByIdHttpResponse } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';

export function findRolloutTemplateByIdHttpResponseMapper(response: FindRolloutTemplateByIdOut): GetRolloutByIdHttpResponse {
  return {
    statusCode: 200,
    body: response.rolloutTemplate,
  };
}
