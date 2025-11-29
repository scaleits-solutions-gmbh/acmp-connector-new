import { FindRolloutTemplateByIdIn } from '@/application/ports/primary/rollout-templates/queries/find-rollout-template-by-id/find-rollout-template-by-id.in';
import { FindRolloutTemplateByIdOut } from '@/application/ports/primary/rollout-templates/queries/find-rollout-template-by-id/find-rollout-template-by-id.out';
import { FindRolloutTemplateByIdQueryPrimaryPort } from '@/application/ports/primary/rollout-templates/queries/find-rollout-template-by-id/find-rollout-template-by-id.query.port';
import { RolloutTemplateQueryRepositorySecondaryPort } from '@/application/ports/secondary/repositories/rollout-templates/rollout-template.query-repository';

export class FindRolloutTemplateByIdQuery implements FindRolloutTemplateByIdQueryPrimaryPort {
  public constructor(private readonly rolloutTemplateQueryRepository: RolloutTemplateQueryRepositorySecondaryPort) {}

  public async execute(input: FindRolloutTemplateByIdIn): Promise<FindRolloutTemplateByIdOut> {
    const rolloutTemplate = await this.rolloutTemplateQueryRepository.findRolloutTemplateById(input.id);

    if (!rolloutTemplate) {
      throw new Error('RolloutTemplate not found');
    }

    return FindRolloutTemplateByIdOut.create(rolloutTemplate);
  }
}
