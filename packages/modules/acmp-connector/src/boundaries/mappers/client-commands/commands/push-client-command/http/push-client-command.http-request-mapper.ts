import { PushClientCommandCommandIn } from 'acmp-connector-bounded-context';
import { PushClientCommandHttpRequest } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';

export function pushClientCommandHttpRequestMapper(request: PushClientCommandHttpRequest): PushClientCommandCommandIn {
  return PushClientCommandCommandIn.create({
    clientCommandId: request.pathParams.id,
    clientIds: request.body.clientIds,
  });
}
