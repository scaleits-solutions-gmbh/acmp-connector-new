import { PushClientCommandCommandOut } from 'acmp-connector-bounded-context';
import { PushClientCommandHttpResponse } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';

export function pushClientCommandHttpResponseMapper(response: PushClientCommandCommandOut): PushClientCommandHttpResponse {
  return {
    statusCode: 202,
    body: {
      success: response.success,
      jobId: response.jobId,
    },
  };
}
