import {
  AcmpJobReadModel,
} from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';
import { PaginationOption } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit';
import { PaginatedData } from '@scaleits-solutions-gmbh/org-lib-global-common-kit';

export type FindPaginatedJobsFilters = {
  searchTerm?: string;
  kind?: string;
  origin?: string;
};

/**
 * Query repository for reading job data from ACMP MSSQL database.
 */
export interface JobQueryRepositorySecondaryPort {
  /**
   * Find paginated list of jobs
   */
  findPaginatedJobs(pagination: PaginationOption, filters?: FindPaginatedJobsFilters): Promise<PaginatedData<AcmpJobReadModel>>;

  /**
   * Find job by ID
   */
  findJobById(id: string): Promise<AcmpJobReadModel | null>;

  /**
   * Count jobs with optional filters
   */
  findJobCount(filters?: FindPaginatedJobsFilters): Promise<number>;
}
