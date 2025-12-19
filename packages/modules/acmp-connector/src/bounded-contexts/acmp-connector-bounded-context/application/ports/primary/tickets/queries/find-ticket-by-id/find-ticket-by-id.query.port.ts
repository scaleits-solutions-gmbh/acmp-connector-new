import { BaseApiPort } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit';
import { FindTicketByIdIn } from './find-ticket-by-id.in';
import { FindTicketByIdOut } from './find-ticket-by-id.out';

export interface FindTicketByIdQueryPrimaryPort extends BaseApiPort<FindTicketByIdIn, FindTicketByIdOut> {}
