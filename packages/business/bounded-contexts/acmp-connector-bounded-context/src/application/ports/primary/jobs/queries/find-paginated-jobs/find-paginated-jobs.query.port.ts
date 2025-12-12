import { FindPaginatedJobsIn } from './find-paginated-jobs.in';
import { FindPaginatedJobsOut } from './find-paginated-jobs.out';
import { BaseApiPort } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit';

export interface FindPaginatedJobsQueryPrimaryPort extends BaseApiPort<FindPaginatedJobsIn, FindPaginatedJobsOut> {}
