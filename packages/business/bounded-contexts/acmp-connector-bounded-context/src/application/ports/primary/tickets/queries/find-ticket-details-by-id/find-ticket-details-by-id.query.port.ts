import { FindTicketDetailsByIdIn } from './find-ticket-details-by-id.in';
import { FindTicketDetailsByIdOut } from './find-ticket-details-by-id.out';

export interface FindTicketDetailsByIdQueryPrimaryPort {
  execute(input: FindTicketDetailsByIdIn): Promise<FindTicketDetailsByIdOut>;
}
