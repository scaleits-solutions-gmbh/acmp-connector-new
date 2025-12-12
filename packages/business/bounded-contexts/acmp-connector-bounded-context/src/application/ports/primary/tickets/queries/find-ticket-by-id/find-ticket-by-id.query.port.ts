import { FindTicketByIdIn } from './find-ticket-by-id.in';
import { FindTicketByIdOut } from './find-ticket-by-id.out';
import { BaseApiPort } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit';

export interface FindTicketByIdQueryPrimaryPort extends BaseApiPort<FindTicketByIdIn, FindTicketByIdOut> {}
