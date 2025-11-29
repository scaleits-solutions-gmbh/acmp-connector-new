import {
  MssqlUtils
} from '@/infra/mssql/client';
import { JobQueryRepositorySecondaryPort, FindPaginatedJobsFilters } from '@repo/business/bounded-contexts/acmp-connector-bounded-context';
import { PaginationOption } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit';
import { PaginatedData, paginateExternalData } from '@scaleits-solutions-gmbh/org-lib-global-common-kit';
import { AcmpJobReadModel } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';

import { findPaginatedJobsQueryMethod } from './query-methods/find-paginated-jobs.query-method';
import { findJobByIdQueryMethod } from './query-methods/find-job-by-id.query-method';
import { findJobCountQueryMethod } from './query-methods/find-job-count.query-method';

export class MssqlJobQueryRepository implements JobQueryRepositorySecondaryPort {
  /**
   * Find paginated list of jobs
   */
  async findPaginatedJobs(
    pagination: PaginationOption,
    filters?: FindPaginatedJobsFilters,
  ): Promise<PaginatedData<AcmpJobReadModel>> {
    const data = await findPaginatedJobsQueryMethod(pagination, filters);
    return data;
  }

  /**
   * Find job by ID
   */
  async findJobById(id: string): Promise<AcmpJobReadModel | null> {
    const job = await findJobByIdQueryMethod(id);
    return job;
  }

  /**
   * Count jobs with optional filters
   */
  async findJobCount(filters?: FindPaginatedJobsFilters): Promise<number> {
    const count = await findJobCountQueryMethod(filters);
    return count;
  }
}

