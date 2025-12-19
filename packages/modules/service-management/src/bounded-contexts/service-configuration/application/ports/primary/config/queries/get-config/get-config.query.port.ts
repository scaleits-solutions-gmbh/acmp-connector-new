import { BaseApiPort } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit';
import { GetConfigIn } from './get-config.in';
import { GetConfigOut } from './get-config.out';

export interface GetConfigQueryPrimaryPort extends BaseApiPort<GetConfigIn, GetConfigOut> {}
