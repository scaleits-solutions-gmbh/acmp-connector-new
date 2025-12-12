import { BaseApiPort } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit';
import { FindPaginatedJobsIn } from './find-paginated-jobs.in';
import { FindPaginatedJobsOut } from './find-paginated-jobs.out';

export interface FindPaginatedJobsQueryPrimaryPort extends BaseApiPort<FindPaginatedJobsIn, FindPaginatedJobsOut> {}
