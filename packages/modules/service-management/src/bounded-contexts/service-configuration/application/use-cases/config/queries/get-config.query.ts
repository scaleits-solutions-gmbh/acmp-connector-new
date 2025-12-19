import { BaseApi } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit/common';
import { GetConfigIn } from 'service-configuration/application/ports/primary/config/queries/get-config/get-config.in';
import { GetConfigOut } from 'service-configuration/application/ports/primary/config/queries/get-config/get-config.out';
import { GetConfigQueryPrimaryPort } from 'service-configuration/application/ports/primary/config/queries/get-config/get-config.query.port';

export class GetConfigQuery extends BaseApi<GetConfigIn, GetConfigOut> implements GetConfigQueryPrimaryPort {
  protected async handle(_input: GetConfigIn): Promise<GetConfigOut> {
    throw new Error('GetConfigQuery not implemented');
  }
}
