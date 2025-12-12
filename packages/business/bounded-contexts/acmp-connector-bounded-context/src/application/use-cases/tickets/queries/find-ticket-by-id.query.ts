import { FindTicketByIdIn } from '@/application/ports/primary/tickets/queries/find-ticket-by-id/find-ticket-by-id.in';
import { FindTicketByIdOut } from '@/application/ports/primary/tickets/queries/find-ticket-by-id/find-ticket-by-id.out';
import { FindTicketByIdQueryPrimaryPort } from '@/application/ports/primary/tickets/queries/find-ticket-by-id/find-ticket-by-id.query.port';
import { TicketQueryRepositorySecondaryPort } from '@/application/ports/secondary/repositories/tickets/ticket.query-repository';
import { BaseApi, NotFoundError } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit/common';

export class FindTicketByIdQuery extends BaseApi<FindTicketByIdIn, FindTicketByIdOut> implements FindTicketByIdQueryPrimaryPort {
  public constructor(private readonly ticketQueryRepository: TicketQueryRepositorySecondaryPort) {
    super();
  }

  protected async handle(input: FindTicketByIdIn): Promise<FindTicketByIdOut> {
    const ticket = await this.ticketQueryRepository.findTicketById(input.id);

    if (!ticket) {
      throw new NotFoundError({ message: 'Ticket not found' });
    }

    return FindTicketByIdOut.create(ticket);
  }
}
