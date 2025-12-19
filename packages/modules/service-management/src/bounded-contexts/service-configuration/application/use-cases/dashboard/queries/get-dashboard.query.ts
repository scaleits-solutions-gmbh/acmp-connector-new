import { BaseApi } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit/common';
import { GetDashboardIn } from 'service-configuration/application/ports/primary/dashboard/queries/get-dashboard/get-dashboard.in';
import { GetDashboardOut } from 'service-configuration/application/ports/primary/dashboard/queries/get-dashboard/get-dashboard.out';
import { GetDashboardQueryPrimaryPort } from 'service-configuration/application/ports/primary/dashboard/queries/get-dashboard/get-dashboard.query.port';

export class GetDashboardQuery extends BaseApi<GetDashboardIn, GetDashboardOut> implements GetDashboardQueryPrimaryPort {
  protected async handle(_input: GetDashboardIn): Promise<GetDashboardOut> {
    throw new Error('GetDashboardQuery not implemented');
  }
}
