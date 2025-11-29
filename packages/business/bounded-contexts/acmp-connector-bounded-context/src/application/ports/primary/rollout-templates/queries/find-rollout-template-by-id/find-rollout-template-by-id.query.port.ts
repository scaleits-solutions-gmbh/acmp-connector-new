import { FindRolloutTemplateByIdIn } from './find-rollout-template-by-id.in';
import { FindRolloutTemplateByIdOut } from './find-rollout-template-by-id.out';

export interface FindRolloutTemplateByIdQueryPrimaryPort {
  execute(input: FindRolloutTemplateByIdIn): Promise<FindRolloutTemplateByIdOut>;
}
