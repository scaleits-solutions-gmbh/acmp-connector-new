import { FindClientByIdOut } from 'acmp-connector-bounded-context';
import { GetClientByIdHttpResponse } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';

export function findClientByIdHttpResponseMapper(response: FindClientByIdOut): GetClientByIdHttpResponse {
  return {
    statusCode: 200,
    body: response.client,
  };
}
