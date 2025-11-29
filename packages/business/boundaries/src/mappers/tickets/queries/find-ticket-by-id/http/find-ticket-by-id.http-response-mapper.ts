import { FindTicketByIdOut } from '@repo/business/bounded-contexts/acmp-connector-bounded-context';
import { GetTicketByIdHttpResponse } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';

export function findTicketByIdHttpResponseMapper(response: FindTicketByIdOut): GetTicketByIdHttpResponse {
  return {
    statusCode: 200,
    body: response.ticket,
  };
}
