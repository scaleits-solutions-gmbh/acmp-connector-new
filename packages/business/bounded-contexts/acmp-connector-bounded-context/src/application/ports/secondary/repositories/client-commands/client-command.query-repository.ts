import {
  AcmpClientCommandReadModel,
} from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';
import { PaginationOption } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit';
import { PaginatedData } from '@scaleits-solutions-gmbh/org-lib-global-common-kit';

export type FindPaginatedClientCommandsFilters = {
  searchTerm?: string;
};

/**
 * Query repository for reading client command data from ACMP MSSQL database.
 */
export interface ClientCommandQueryRepositorySecondaryPort {
  /**
   * Find paginated list of client commands
   */
  findPaginatedClientCommands(pagination: PaginationOption, filters?: FindPaginatedClientCommandsFilters): Promise<PaginatedData<AcmpClientCommandReadModel>>;

  /**
   * Find client command by ID
   */
  findClientCommandById(id: string): Promise<AcmpClientCommandReadModel | null>;

  /**
   * Count client commands with optional filters
   */
  findClientCommandCount(filters?: FindPaginatedClientCommandsFilters): Promise<number>;
}
