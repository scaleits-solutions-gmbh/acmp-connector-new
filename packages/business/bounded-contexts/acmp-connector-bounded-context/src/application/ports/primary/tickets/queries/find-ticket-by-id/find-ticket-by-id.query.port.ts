import { FindTicketByIdIn } from './find-ticket-by-id.in';
import { FindTicketByIdOut } from './find-ticket-by-id.out';

export interface FindTicketByIdQueryPrimaryPort {
  execute(input: FindTicketByIdIn): Promise<FindTicketByIdOut>;
}
