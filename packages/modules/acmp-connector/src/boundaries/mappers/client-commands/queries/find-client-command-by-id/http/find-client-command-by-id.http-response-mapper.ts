import { FindClientCommandByIdOut } from 'acmp-connector-bounded-context';
import { GetClientCommandByIdHttpResponse } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';

export function findClientCommandByIdHttpResponseMapper(response: FindClientCommandByIdOut): GetClientCommandByIdHttpResponse {
  return {
    statusCode: 200,
    body: response.clientCommand,
  };
}
