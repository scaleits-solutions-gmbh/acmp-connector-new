import { BaseApi } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit/common';
import { FindRolloutTemplateCountIn } from '@/application/ports/primary/rollout-templates/queries/find-rollout-template-count/find-rollout-template-count.in';
import { FindRolloutTemplateCountOut } from '@/application/ports/primary/rollout-templates/queries/find-rollout-template-count/find-rollout-template-count.out';
import { FindRolloutTemplateCountQueryPrimaryPort } from '@/application/ports/primary/rollout-templates/queries/find-rollout-template-count/find-rollout-template-count.query.port';
import { RolloutTemplateQueryRepositorySecondaryPort } from '@/application/ports/secondary/repositories/rollout-templates/rollout-template.query-repository';

export class FindRolloutTemplateCountQuery extends BaseApi<FindRolloutTemplateCountIn, FindRolloutTemplateCountOut> implements FindRolloutTemplateCountQueryPrimaryPort {
  public constructor(private readonly rolloutTemplateQueryRepository: RolloutTemplateQueryRepositorySecondaryPort) {
    super();
  }

  protected async handle(input: FindRolloutTemplateCountIn): Promise<FindRolloutTemplateCountOut> {
    const filters = input.filters ? {
      searchTerm: input.filters?.searchTerm,
      os: input.filters?.os,
    } : undefined;

    const count = await this.rolloutTemplateQueryRepository.findRolloutTemplateCount(filters);

    return FindRolloutTemplateCountOut.create({ count });
  }
}
