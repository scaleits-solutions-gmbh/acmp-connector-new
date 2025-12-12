import { FindPaginatedClientsIn } from './find-paginated-clients.in';
import { FindPaginatedClientsOut } from './find-paginated-clients.out';
import { BaseApiPort } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit';

export interface FindPaginatedClientsQueryPrimaryPort extends BaseApiPort<FindPaginatedClientsIn, FindPaginatedClientsOut> {}
