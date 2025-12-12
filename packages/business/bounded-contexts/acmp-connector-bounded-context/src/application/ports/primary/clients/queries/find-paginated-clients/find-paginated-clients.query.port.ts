import { BaseApiPort } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit';
import { FindPaginatedClientsIn } from './find-paginated-clients.in';
import { FindPaginatedClientsOut } from './find-paginated-clients.out';

export interface FindPaginatedClientsQueryPrimaryPort extends BaseApiPort<FindPaginatedClientsIn, FindPaginatedClientsOut> {}
