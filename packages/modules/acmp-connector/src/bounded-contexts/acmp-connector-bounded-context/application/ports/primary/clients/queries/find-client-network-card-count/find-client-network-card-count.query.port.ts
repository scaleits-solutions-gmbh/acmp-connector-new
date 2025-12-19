import { FindClientNetworkCardCountIn } from './find-client-network-card-count.in';
import { FindClientNetworkCardCountOut } from './find-client-network-card-count.out';

export interface FindClientNetworkCardCountQueryPrimaryPort {
  execute(input: FindClientNetworkCardCountIn): Promise<FindClientNetworkCardCountOut>;
}
