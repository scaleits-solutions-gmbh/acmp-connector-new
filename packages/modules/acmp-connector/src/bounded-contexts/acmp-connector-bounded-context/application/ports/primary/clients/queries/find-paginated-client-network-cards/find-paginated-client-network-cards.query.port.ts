import { FindPaginatedClientNetworkCardsIn } from './find-paginated-client-network-cards.in';
import { FindPaginatedClientNetworkCardsOut } from './find-paginated-client-network-cards.out';

export interface FindPaginatedClientNetworkCardsQueryPrimaryPort {
  execute(input: FindPaginatedClientNetworkCardsIn): Promise<FindPaginatedClientNetworkCardsOut>;
}
