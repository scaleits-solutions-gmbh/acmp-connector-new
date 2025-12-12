import { BaseApiPort } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit';
import { FindClientByIdIn } from './find-client-by-id.in';
import { FindClientByIdOut } from './find-client-by-id.out';

export interface FindClientByIdQueryPrimaryPort extends BaseApiPort<FindClientByIdIn, FindClientByIdOut> {}
