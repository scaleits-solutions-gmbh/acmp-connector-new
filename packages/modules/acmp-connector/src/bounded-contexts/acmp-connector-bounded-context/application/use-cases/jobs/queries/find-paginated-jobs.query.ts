import { BaseApi, PaginationOption } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit/common';
import { FindPaginatedJobsIn } from 'acmp-connector-bounded-context/application/ports/primary/jobs/queries/find-paginated-jobs/find-paginated-jobs.in';
import { FindPaginatedJobsOut } from 'acmp-connector-bounded-context/application/ports/primary/jobs/queries/find-paginated-jobs/find-paginated-jobs.out';
import { FindPaginatedJobsQueryPrimaryPort } from 'acmp-connector-bounded-context/application/ports/primary/jobs/queries/find-paginated-jobs/find-paginated-jobs.query.port';
import { JobQueryRepositorySecondaryPort } from 'acmp-connector-bounded-context/application/ports/secondary/repositories/jobs/job.query-repository';

export class FindPaginatedJobsQuery extends BaseApi<FindPaginatedJobsIn, FindPaginatedJobsOut> implements FindPaginatedJobsQueryPrimaryPort {
  public constructor(private readonly jobQueryRepository: JobQueryRepositorySecondaryPort) {
    super();
  }

  protected async handle(input: FindPaginatedJobsIn): Promise<FindPaginatedJobsOut> {
    const paginationOption: PaginationOption = {
      page: input.paginationOptions.page,
      pageSize: input.paginationOptions.pageSize,
    };

    const filters = input.filters
      ? {
          searchTerm: input.filters?.searchTerm,
          kind: input.filters?.kind,
          origin: input.filters?.origin,
        }
      : undefined;

    const paginatedData = await this.jobQueryRepository.findPaginatedJobs(paginationOption, filters);

    return FindPaginatedJobsOut.create(paginatedData);
  }
}
