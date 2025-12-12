import { FindClientCountIn } from './find-client-count.in';
import { FindClientCountOut } from './find-client-count.out';
import { BaseApiPort } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit';

export interface FindClientCountQueryPrimaryPort extends BaseApiPort<FindClientCountIn, FindClientCountOut> {}
