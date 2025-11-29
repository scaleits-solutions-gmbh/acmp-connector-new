import { FindPaginatedClientsIn } from './find-paginated-clients.in';
import { FindPaginatedClientsOut } from './find-paginated-clients.out';

export interface FindPaginatedClientsQueryPrimaryPort {
  execute(input: FindPaginatedClientsIn): Promise<FindPaginatedClientsOut>;
}
