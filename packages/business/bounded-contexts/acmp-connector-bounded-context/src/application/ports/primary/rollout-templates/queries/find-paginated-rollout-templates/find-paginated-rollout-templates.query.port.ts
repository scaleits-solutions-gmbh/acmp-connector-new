import { FindPaginatedRolloutTemplatesIn } from './find-paginated-rollout-templates.in';
import { FindPaginatedRolloutTemplatesOut } from './find-paginated-rollout-templates.out';
import { BaseApiPort } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit';

export interface FindPaginatedRolloutTemplatesQueryPrimaryPort extends BaseApiPort<FindPaginatedRolloutTemplatesIn, FindPaginatedRolloutTemplatesOut> {}
