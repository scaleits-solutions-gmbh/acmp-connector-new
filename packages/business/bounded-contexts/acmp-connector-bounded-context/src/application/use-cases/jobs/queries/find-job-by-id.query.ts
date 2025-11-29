import { FindJobByIdIn } from '@/application/ports/primary/jobs/queries/find-job-by-id/find-job-by-id.in';
import { FindJobByIdOut } from '@/application/ports/primary/jobs/queries/find-job-by-id/find-job-by-id.out';
import { FindJobByIdQueryPrimaryPort } from '@/application/ports/primary/jobs/queries/find-job-by-id/find-job-by-id.query.port';
import { JobQueryRepositorySecondaryPort } from '@/application/ports/secondary/repositories/jobs/job.query-repository';

export class FindJobByIdQuery implements FindJobByIdQueryPrimaryPort {
  public constructor(private readonly jobQueryRepository: JobQueryRepositorySecondaryPort) {}

  public async execute(input: FindJobByIdIn): Promise<FindJobByIdOut> {
    const job = await this.jobQueryRepository.findJobById(input.id);

    if (!job) {
      throw new Error('Job not found');
    }

    return FindJobByIdOut.create(job);
  }
}
