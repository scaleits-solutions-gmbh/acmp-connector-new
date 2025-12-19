import { BaseApiPort } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit';
import { FindPaginatedAssetsIn } from './find-paginated-assets.in';
import { FindPaginatedAssetsOut } from './find-paginated-assets.out';

export interface FindPaginatedAssetsQueryPrimaryPort extends BaseApiPort<FindPaginatedAssetsIn, FindPaginatedAssetsOut> {}
