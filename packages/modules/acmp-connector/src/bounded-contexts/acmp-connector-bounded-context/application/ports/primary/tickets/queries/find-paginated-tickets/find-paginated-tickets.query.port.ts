import { BaseApiPort } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit';
import { FindPaginatedTicketsIn } from './find-paginated-tickets.in';
import { FindPaginatedTicketsOut } from './find-paginated-tickets.out';

export interface FindPaginatedTicketsQueryPrimaryPort extends BaseApiPort<FindPaginatedTicketsIn, FindPaginatedTicketsOut> {}
