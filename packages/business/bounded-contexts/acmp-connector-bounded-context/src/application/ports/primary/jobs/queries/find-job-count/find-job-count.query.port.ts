import { FindJobCountIn } from './find-job-count.in';
import { FindJobCountOut } from './find-job-count.out';
import { BaseApiPort } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit';

export interface FindJobCountQueryPrimaryPort extends BaseApiPort<FindJobCountIn, FindJobCountOut> {}
