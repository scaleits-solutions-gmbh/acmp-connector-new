import { BaseApi, NotFoundError } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit/common';
import { FindRolloutTemplateByIdIn } from 'acmp-connector-bounded-context/application/ports/primary/rollout-templates/queries/find-rollout-template-by-id/find-rollout-template-by-id.in';
import { FindRolloutTemplateByIdOut } from 'acmp-connector-bounded-context/application/ports/primary/rollout-templates/queries/find-rollout-template-by-id/find-rollout-template-by-id.out';
import { FindRolloutTemplateByIdQueryPrimaryPort } from 'acmp-connector-bounded-context/application/ports/primary/rollout-templates/queries/find-rollout-template-by-id/find-rollout-template-by-id.query.port';
import { RolloutTemplateQueryRepositorySecondaryPort } from 'acmp-connector-bounded-context/application/ports/secondary/repositories/rollout-templates/rollout-template.query-repository';

export class FindRolloutTemplateByIdQuery extends BaseApi<FindRolloutTemplateByIdIn, FindRolloutTemplateByIdOut> implements FindRolloutTemplateByIdQueryPrimaryPort {
  public constructor(private readonly rolloutTemplateQueryRepository: RolloutTemplateQueryRepositorySecondaryPort) {
    super();
  }

  protected async handle(input: FindRolloutTemplateByIdIn): Promise<FindRolloutTemplateByIdOut> {
    const rolloutTemplate = await this.rolloutTemplateQueryRepository.findRolloutTemplateById(input.id);

    if (!rolloutTemplate) {
      throw new NotFoundError({ message: 'RolloutTemplate not found' });
    }

    return FindRolloutTemplateByIdOut.create(rolloutTemplate);
  }
}
