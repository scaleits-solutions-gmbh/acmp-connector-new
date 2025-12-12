import { BaseApi } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit/common';
import { FindTicketCountIn } from '@/application/ports/primary/tickets/queries/find-ticket-count/find-ticket-count.in';
import { FindTicketCountOut } from '@/application/ports/primary/tickets/queries/find-ticket-count/find-ticket-count.out';
import { FindTicketCountQueryPrimaryPort } from '@/application/ports/primary/tickets/queries/find-ticket-count/find-ticket-count.query.port';
import { TicketQueryRepositorySecondaryPort } from '@/application/ports/secondary/repositories/tickets/ticket.query-repository';

export class FindTicketCountQuery extends BaseApi<FindTicketCountIn, FindTicketCountOut> implements FindTicketCountQueryPrimaryPort {
  public constructor(private readonly ticketQueryRepository: TicketQueryRepositorySecondaryPort) {
    super();
  }

  protected async handle(input: FindTicketCountIn): Promise<FindTicketCountOut> {
    const filters = input.filters ? { searchTerm: input.filters?.searchTerm } : undefined;

    const count = await this.ticketQueryRepository.findTicketCount(filters);

    return FindTicketCountOut.create({ count });
  }
}
