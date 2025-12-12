import { FindTicketDetailsByIdIn } from './find-ticket-details-by-id.in';
import { FindTicketDetailsByIdOut } from './find-ticket-details-by-id.out';
import { BaseApiPort } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit';

export interface FindTicketDetailsByIdQueryPrimaryPort extends BaseApiPort<FindTicketDetailsByIdIn, FindTicketDetailsByIdOut> {}
