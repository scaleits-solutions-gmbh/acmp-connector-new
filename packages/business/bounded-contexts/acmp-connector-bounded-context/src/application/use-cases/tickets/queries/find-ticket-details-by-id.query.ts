import { BaseApi, NotFoundError } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit/common';
import { FindTicketDetailsByIdIn } from '@/application/ports/primary/tickets/queries/find-ticket-details-by-id/find-ticket-details-by-id.in';
import { FindTicketDetailsByIdOut } from '@/application/ports/primary/tickets/queries/find-ticket-details-by-id/find-ticket-details-by-id.out';
import { FindTicketDetailsByIdQueryPrimaryPort } from '@/application/ports/primary/tickets/queries/find-ticket-details-by-id/find-ticket-details-by-id.query.port';
import { TicketQueryRepositorySecondaryPort } from '@/application/ports/secondary/repositories/tickets/ticket.query-repository';

export class FindTicketDetailsByIdQuery extends BaseApi<FindTicketDetailsByIdIn, FindTicketDetailsByIdOut> implements FindTicketDetailsByIdQueryPrimaryPort {
  public constructor(private readonly ticketQueryRepository: TicketQueryRepositorySecondaryPort) {
    super();
  }

  protected async handle(input: FindTicketDetailsByIdIn): Promise<FindTicketDetailsByIdOut> {
    const ticketDetails = await this.ticketQueryRepository.findTicketDetailsById(input.id);

    if (!ticketDetails) {
      throw new NotFoundError({ message: 'TicketDetails not found' });
    }

    return FindTicketDetailsByIdOut.create(ticketDetails);
  }
}
