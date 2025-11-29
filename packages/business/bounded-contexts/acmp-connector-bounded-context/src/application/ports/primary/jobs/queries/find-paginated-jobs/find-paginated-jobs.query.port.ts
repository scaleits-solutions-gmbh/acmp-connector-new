import { FindPaginatedJobsIn } from './find-paginated-jobs.in';
import { FindPaginatedJobsOut } from './find-paginated-jobs.out';

export interface FindPaginatedJobsQueryPrimaryPort {
  execute(input: FindPaginatedJobsIn): Promise<FindPaginatedJobsOut>;
}
