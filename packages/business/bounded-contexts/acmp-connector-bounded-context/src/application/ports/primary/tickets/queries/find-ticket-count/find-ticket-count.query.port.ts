import { BaseApiPort } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit';
import { FindTicketCountIn } from './find-ticket-count.in';
import { FindTicketCountOut } from './find-ticket-count.out';

export interface FindTicketCountQueryPrimaryPort extends BaseApiPort<FindTicketCountIn, FindTicketCountOut> {}
