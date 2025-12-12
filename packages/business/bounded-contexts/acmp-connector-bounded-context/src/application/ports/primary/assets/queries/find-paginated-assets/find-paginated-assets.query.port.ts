import { FindPaginatedAssetsIn } from './find-paginated-assets.in';
import { FindPaginatedAssetsOut } from './find-paginated-assets.out';
import { BaseApiPort } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit';

export interface FindPaginatedAssetsQueryPrimaryPort extends BaseApiPort<FindPaginatedAssetsIn, FindPaginatedAssetsOut> {}
