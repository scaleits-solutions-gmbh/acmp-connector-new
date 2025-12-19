import { BaseApiPort } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit';
import { GetDashboardIn } from './get-dashboard.in';
import { GetDashboardOut } from './get-dashboard.out';

export interface GetDashboardQueryPrimaryPort extends BaseApiPort<GetDashboardIn, GetDashboardOut> {}
