import {
  MssqlUtils
} from '@/infra/mssql/client';
import { ClientQueryRepositorySecondaryPort, FindPaginatedClientsFilters } from '@repo/business/bounded-contexts/acmp-connector-bounded-context';
import { PaginationOption } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit';
import { PaginatedData, paginateExternalData } from '@scaleits-solutions-gmbh/org-lib-global-common-kit';
import { AcmpClientReadModel } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';

import { findPaginatedClientsQueryMethod } from './query-methods/find-paginated-clients.query-method';
import { findClientByIdQueryMethod } from './query-methods/find-client-by-id.query-method';
import { findClientCountQueryMethod } from './query-methods/find-client-count.query-method';
import { BaseSpi } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit/common';

export class MssqlClientQueryRepository extends BaseSpi implements ClientQueryRepositorySecondaryPort {
  public constructor() {
    super();
  }
  /**
   * Find paginated list of clients
   */
  async findPaginatedClients(
    pagination: PaginationOption,
    filters?: FindPaginatedClientsFilters,
  ): Promise<PaginatedData<AcmpClientReadModel>> {
    const data = await findPaginatedClientsQueryMethod(pagination, filters);
    return data;
  }

  /**
   * Find client by ID
   */
  async findClientById(id: string): Promise<AcmpClientReadModel | null> {
    const client = await findClientByIdQueryMethod(id);
    return client;
  }

  /**
   * Count clients with optional filters
   */
  async findClientCount(filters?: FindPaginatedClientsFilters): Promise<number> {
    const count = await findClientCountQueryMethod(filters);
    return count;
  }
}

