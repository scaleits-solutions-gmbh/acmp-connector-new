import { FindPaginatedRolloutTemplatesIn } from './find-paginated-rollout-templates.in';
import { FindPaginatedRolloutTemplatesOut } from './find-paginated-rollout-templates.out';

export interface FindPaginatedRolloutTemplatesQueryPrimaryPort {
  execute(input: FindPaginatedRolloutTemplatesIn): Promise<FindPaginatedRolloutTemplatesOut>;
}
