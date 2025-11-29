import {
  AcmpClientNetworkCardListItemReadModel,
} from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';
import { PaginationOption } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit';
import { PaginatedData } from '@scaleits-solutions-gmbh/org-lib-global-common-kit';

/**
 * Query repository for reading client network card data from ACMP MSSQL database.
 */
export interface ClientNetworkCardQueryRepositorySecondaryPort {
  /**
   * Find paginated list of network cards for a client
   */
  findPaginatedClientNetworkCards(clientId: string, pagination: PaginationOption): Promise<PaginatedData<AcmpClientNetworkCardListItemReadModel>>;

  /**
   * Count network cards for a client
   */
  findClientNetworkCardCount(clientId: string): Promise<number>;
}
