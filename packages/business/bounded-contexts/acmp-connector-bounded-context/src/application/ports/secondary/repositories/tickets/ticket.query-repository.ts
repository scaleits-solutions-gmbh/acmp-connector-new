import {
  AcmpTicketListItemReadModel,
  AcmpTicketDetailsReadModel,
} from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';
import { PaginationOption } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit';
import { PaginatedData } from '@scaleits-solutions-gmbh/org-lib-global-common-kit';

export type FindPaginatedTicketsFilters = {
  searchTerm?: string;
};

/**
 * Query repository for reading ticket data from ACMP MSSQL database.
 */
export interface TicketQueryRepositorySecondaryPort {
  /**
   * Find paginated list of tickets
   */
  findPaginatedTickets(pagination: PaginationOption, filters?: FindPaginatedTicketsFilters): Promise<PaginatedData<AcmpTicketListItemReadModel>>;

  /**
   * Find ticket by ID
   */
  findTicketById(id: string): Promise<AcmpTicketListItemReadModel | null>;

  /**
   * Find ticket details by ID
   */
  findTicketDetailsById(id: string): Promise<AcmpTicketDetailsReadModel | null>;

  /**
   * Count tickets with optional filters
   */
  findTicketCount(filters?: FindPaginatedTicketsFilters): Promise<number>;
}
