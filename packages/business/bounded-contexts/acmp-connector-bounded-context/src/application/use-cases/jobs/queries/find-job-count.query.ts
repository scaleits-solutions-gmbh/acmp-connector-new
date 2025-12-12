import { BaseApi } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit/common';
import { FindJobCountIn } from '@/application/ports/primary/jobs/queries/find-job-count/find-job-count.in';
import { FindJobCountOut } from '@/application/ports/primary/jobs/queries/find-job-count/find-job-count.out';
import { FindJobCountQueryPrimaryPort } from '@/application/ports/primary/jobs/queries/find-job-count/find-job-count.query.port';
import { JobQueryRepositorySecondaryPort } from '@/application/ports/secondary/repositories/jobs/job.query-repository';

export class FindJobCountQuery extends BaseApi<FindJobCountIn, FindJobCountOut> implements FindJobCountQueryPrimaryPort {
  public constructor(private readonly jobQueryRepository: JobQueryRepositorySecondaryPort) {
    super();
  }

  protected async handle(input: FindJobCountIn): Promise<FindJobCountOut> {
    const filters = input.filters ? {
      searchTerm: input.filters?.searchTerm,
      kind: input.filters?.kind,
      origin: input.filters?.origin,
    } : undefined;

    const count = await this.jobQueryRepository.findJobCount(filters);

    return FindJobCountOut.create({ count });
  }
}
