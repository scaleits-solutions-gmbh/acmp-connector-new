import { FindPaginatedTicketsIn } from '@/application/ports/primary/tickets/queries/find-paginated-tickets/find-paginated-tickets.in';
import { FindPaginatedTicketsOut } from '@/application/ports/primary/tickets/queries/find-paginated-tickets/find-paginated-tickets.out';
import { FindPaginatedTicketsQueryPrimaryPort } from '@/application/ports/primary/tickets/queries/find-paginated-tickets/find-paginated-tickets.query.port';
import { TicketQueryRepositorySecondaryPort } from '@/application/ports/secondary/repositories/tickets/ticket.query-repository';
import { BaseApi, PaginationOption } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit/common';

export class FindPaginatedTicketsQuery extends BaseApi<FindPaginatedTicketsIn, FindPaginatedTicketsOut> implements FindPaginatedTicketsQueryPrimaryPort {
  public constructor(private readonly ticketQueryRepository: TicketQueryRepositorySecondaryPort) {
    super();
  }

  protected async handle(input: FindPaginatedTicketsIn): Promise<FindPaginatedTicketsOut> {
    const paginationOption: PaginationOption = {
      page: input.paginationOptions.page,
      pageSize: input.paginationOptions.pageSize,
    };

    const filters = input.filters ? { searchTerm: input.filters?.searchTerm } : undefined;

    const paginatedData = await this.ticketQueryRepository.findPaginatedTickets(paginationOption, filters);

    return FindPaginatedTicketsOut.create(paginatedData);
  }
}
