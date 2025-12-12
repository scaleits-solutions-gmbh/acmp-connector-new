import { FindJobByIdIn } from './find-job-by-id.in';
import { FindJobByIdOut } from './find-job-by-id.out';
import { BaseApiPort } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit';

export interface FindJobByIdQueryPrimaryPort extends BaseApiPort<FindJobByIdIn, FindJobByIdOut> {}
