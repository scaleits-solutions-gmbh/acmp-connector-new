import { FindTicketCountIn } from './find-ticket-count.in';
import { FindTicketCountOut } from './find-ticket-count.out';

export interface FindTicketCountQueryPrimaryPort {
  execute(input: FindTicketCountIn): Promise<FindTicketCountOut>;
}
