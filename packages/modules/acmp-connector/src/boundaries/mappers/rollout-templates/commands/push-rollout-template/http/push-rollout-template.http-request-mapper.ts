import { PushRolloutTemplateCommandIn } from 'acmp-connector-bounded-context';
import { PushRolloutTemplateHttpRequest } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';

export function pushRolloutTemplateHttpRequestMapper(request: PushRolloutTemplateHttpRequest): PushRolloutTemplateCommandIn {
  return PushRolloutTemplateCommandIn.create({
    rolloutTemplateId: request.pathParams.id,
    clientIds: request.body.clients.map((client) => client.id),
  });
}
