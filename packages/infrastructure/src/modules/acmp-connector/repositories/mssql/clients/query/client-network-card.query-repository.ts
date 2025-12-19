import { ClientNetworkCardQueryRepositorySecondaryPort } from '@repo/modules/acmp-connector';
import { PaginationOption } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit';
import { PaginatedData } from '@scaleits-solutions-gmbh/org-lib-global-common-kit';
import { AcmpClientNetworkCardListItemReadModel } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';

import { findPaginatedClientNetworkCardsQueryMethod } from './query-methods/find-paginated-client-network-cards.query-method';
import { findClientNetworkCardCountQueryMethod } from './query-methods/find-client-network-card-count.query-method';
import { BaseSpi } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit/common';
export class MssqlClientNetworkCardQueryRepository extends BaseSpi implements ClientNetworkCardQueryRepositorySecondaryPort {
  public constructor() {
    super();
  }
  /**
   * Find paginated list of network cards for a client
   */
  async findPaginatedClientNetworkCards(clientId: string, pagination: PaginationOption): Promise<PaginatedData<AcmpClientNetworkCardListItemReadModel>> {
    const data = await findPaginatedClientNetworkCardsQueryMethod(clientId, pagination);
    return data;
  }

  /**
   * Count network cards for a client
   */
  async findClientNetworkCardCount(clientId: string): Promise<number> {
    const count = await findClientNetworkCardCountQueryMethod(clientId);
    return count;
  }
}
