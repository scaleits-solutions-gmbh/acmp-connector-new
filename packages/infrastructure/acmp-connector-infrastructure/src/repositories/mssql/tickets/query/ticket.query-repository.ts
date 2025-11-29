import {
  MssqlUtils
} from '@/infra/mssql/client';
import { TicketQueryRepositorySecondaryPort, FindPaginatedTicketsFilters } from '@repo/business/bounded-contexts/acmp-connector-bounded-context';
import { PaginationOption } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit';
import { PaginatedData, paginateExternalData } from '@scaleits-solutions-gmbh/org-lib-global-common-kit';
import { AcmpTicketListItemReadModel, AcmpTicketDetailsReadModel } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';

import { findPaginatedTicketsQueryMethod } from './query-methods/find-paginated-tickets.query-method';
import { findTicketByIdQueryMethod } from './query-methods/find-ticket-by-id.query-method';
import { findTicketDetailsByIdQueryMethod } from './query-methods/find-ticket-details-by-id.query-method';
import { findTicketCountQueryMethod } from './query-methods/find-ticket-count.query-method';

export class MssqlTicketQueryRepository implements TicketQueryRepositorySecondaryPort {
  /**
   * Find paginated list of tickets
   */
  async findPaginatedTickets(
    pagination: PaginationOption,
    filters?: FindPaginatedTicketsFilters,
  ): Promise<PaginatedData<AcmpTicketListItemReadModel>> {
    const data = await findPaginatedTicketsQueryMethod(pagination, filters);
    return data;
  }

  /**
   * Find ticket by ID
   */
  async findTicketById(id: string): Promise<AcmpTicketListItemReadModel | null> {
    const ticket = await findTicketByIdQueryMethod(id);
    return ticket;
  }

  /**
   * Find ticket details by ID
   */
  async findTicketDetailsById(id: string): Promise<AcmpTicketDetailsReadModel | null> {
    const details = await findTicketDetailsByIdQueryMethod(id);
    return details;
  }

  /**
   * Count tickets with optional filters
   */
  async findTicketCount(filters?: FindPaginatedTicketsFilters): Promise<number> {
    const count = await findTicketCountQueryMethod(filters);
    return count;
  }
}

