import { AcmpClientReadModel } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';
import { PaginationOption } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit';
import { PaginatedData } from '@scaleits-solutions-gmbh/org-lib-global-common-kit';

export type FindPaginatedClientsFilters = {
  searchTerm?: string;
  tenantId?: string;
};

/**
 * Query repository for reading client data from ACMP MSSQL database.
 */
export interface ClientQueryRepositorySecondaryPort {
  /**
   * Find paginated list of clients
   */
  findPaginatedClients(pagination: PaginationOption, filters?: FindPaginatedClientsFilters): Promise<PaginatedData<AcmpClientReadModel>>;

  /**
   * Find client by ID
   */
  findClientById(id: string): Promise<AcmpClientReadModel | null>;

  /**
   * Count clients with optional filters
   */
  findClientCount(filters?: FindPaginatedClientsFilters): Promise<number>;
}
