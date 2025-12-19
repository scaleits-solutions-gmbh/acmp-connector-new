import { PushRolloutTemplateCommandOut } from 'acmp-connector-bounded-context';
import { PushRolloutTemplateHttpResponse } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';

export function pushRolloutTemplateHttpResponseMapper(response: PushRolloutTemplateCommandOut): PushRolloutTemplateHttpResponse {
  return {
    statusCode: 202,
    body: {
      success: response.success,
      jobId: response.jobId,
    },
  };
}
