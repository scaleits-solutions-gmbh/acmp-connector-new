import { FindPaginatedTicketsIn } from './find-paginated-tickets.in';
import { FindPaginatedTicketsOut } from './find-paginated-tickets.out';
import { BaseApiPort } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit';

export interface FindPaginatedTicketsQueryPrimaryPort extends BaseApiPort<FindPaginatedTicketsIn, FindPaginatedTicketsOut> {}
