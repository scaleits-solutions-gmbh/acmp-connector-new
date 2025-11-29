import { FindPaginatedTicketsIn } from '@/application/ports/primary/tickets/queries/find-paginated-tickets/find-paginated-tickets.in';
import { FindPaginatedTicketsOut } from '@/application/ports/primary/tickets/queries/find-paginated-tickets/find-paginated-tickets.out';
import { FindPaginatedTicketsQueryPrimaryPort } from '@/application/ports/primary/tickets/queries/find-paginated-tickets/find-paginated-tickets.query.port';
import { TicketQueryRepositorySecondaryPort } from '@/application/ports/secondary/repositories/tickets/ticket.query-repository';
import { PaginationOption } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit';

export class FindPaginatedTicketsQuery implements FindPaginatedTicketsQueryPrimaryPort {
  public constructor(private readonly ticketQueryRepository: TicketQueryRepositorySecondaryPort) {}

  public async execute(input: FindPaginatedTicketsIn): Promise<FindPaginatedTicketsOut> {
    const paginationOption: PaginationOption = {
      page: input.paginationOptions.page,
      pageSize: input.paginationOptions.pageSize,
    };

    const filters = input.filters ? { searchTerm: input.filters?.searchTerm } : undefined;

    const paginatedData = await this.ticketQueryRepository.findPaginatedTickets(paginationOption, filters);

    return FindPaginatedTicketsOut.create(paginatedData);
  }
}
