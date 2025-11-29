import { FindPaginatedTicketsIn } from './find-paginated-tickets.in';
import { FindPaginatedTicketsOut } from './find-paginated-tickets.out';

export interface FindPaginatedTicketsQueryPrimaryPort {
  execute(input: FindPaginatedTicketsIn): Promise<FindPaginatedTicketsOut>;
}
