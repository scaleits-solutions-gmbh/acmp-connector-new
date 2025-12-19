import { FindRolloutTemplateCountIn } from './find-rollout-template-count.in';
import { FindRolloutTemplateCountOut } from './find-rollout-template-count.out';

export interface FindRolloutTemplateCountQueryPrimaryPort {
  execute(input: FindRolloutTemplateCountIn): Promise<FindRolloutTemplateCountOut>;
}
