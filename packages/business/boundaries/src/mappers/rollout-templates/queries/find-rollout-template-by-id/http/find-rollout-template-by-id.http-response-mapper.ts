import { FindRolloutTemplateByIdOut } from '@repo/business/bounded-contexts/acmp-connector-bounded-context';
import { GetRolloutTemplateByIdHttpResponse } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';

export function findRolloutTemplateByIdHttpResponseMapper(response: FindRolloutTemplateByIdOut): GetRolloutTemplateByIdHttpResponse {
  return {
    statusCode: 200,
    body: response.rolloutTemplate,
  };
}
