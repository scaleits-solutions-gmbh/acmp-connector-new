import { BaseApi, NotFoundError } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit/common';
import { FindJobByIdIn } from '@/application/ports/primary/jobs/queries/find-job-by-id/find-job-by-id.in';
import { FindJobByIdOut } from '@/application/ports/primary/jobs/queries/find-job-by-id/find-job-by-id.out';
import { FindJobByIdQueryPrimaryPort } from '@/application/ports/primary/jobs/queries/find-job-by-id/find-job-by-id.query.port';
import { JobQueryRepositorySecondaryPort } from '@/application/ports/secondary/repositories/jobs/job.query-repository';

export class FindJobByIdQuery extends BaseApi<FindJobByIdIn, FindJobByIdOut> implements FindJobByIdQueryPrimaryPort {
  public constructor(private readonly jobQueryRepository: JobQueryRepositorySecondaryPort) {
    super();
  }

  protected async handle(input: FindJobByIdIn): Promise<FindJobByIdOut> {
    const job = await this.jobQueryRepository.findJobById(input.id);

    if (!job) {
      throw new NotFoundError({ message: 'Job not found' });
    }

    return FindJobByIdOut.create(job);
  }
}
