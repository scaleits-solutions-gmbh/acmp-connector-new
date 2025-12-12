import { BaseApiPort } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit';
import { FindJobByIdIn } from './find-job-by-id.in';
import { FindJobByIdOut } from './find-job-by-id.out';

export interface FindJobByIdQueryPrimaryPort extends BaseApiPort<FindJobByIdIn, FindJobByIdOut> {}
