import { BaseApiPort } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit';
import { FindTicketDetailsByIdIn } from './find-ticket-details-by-id.in';
import { FindTicketDetailsByIdOut } from './find-ticket-details-by-id.out';

export interface FindTicketDetailsByIdQueryPrimaryPort extends BaseApiPort<FindTicketDetailsByIdIn, FindTicketDetailsByIdOut> {}
