import { BaseApiPort } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit';
import { FindRolloutTemplateByIdIn } from './find-rollout-template-by-id.in';
import { FindRolloutTemplateByIdOut } from './find-rollout-template-by-id.out';

export interface FindRolloutTemplateByIdQueryPrimaryPort extends BaseApiPort<FindRolloutTemplateByIdIn, FindRolloutTemplateByIdOut> {}
