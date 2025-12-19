import { BaseApi, PaginationOption } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit/common';
import { FindPaginatedClientNetworkCardsIn } from 'acmp-connector-bounded-context/application/ports/primary/clients/queries/find-paginated-client-network-cards/find-paginated-client-network-cards.in';
import { FindPaginatedClientNetworkCardsOut } from 'acmp-connector-bounded-context/application/ports/primary/clients/queries/find-paginated-client-network-cards/find-paginated-client-network-cards.out';
import { FindPaginatedClientNetworkCardsQueryPrimaryPort } from 'acmp-connector-bounded-context/application/ports/primary/clients/queries/find-paginated-client-network-cards/find-paginated-client-network-cards.query.port';
import { ClientNetworkCardQueryRepositorySecondaryPort } from 'acmp-connector-bounded-context/application/ports/secondary/repositories/clients/client-network-card.query-repository';

export class FindPaginatedClientNetworkCardsQuery extends BaseApi<FindPaginatedClientNetworkCardsIn, FindPaginatedClientNetworkCardsOut> implements FindPaginatedClientNetworkCardsQueryPrimaryPort {
  public constructor(private readonly clientNetworkCardQueryRepository: ClientNetworkCardQueryRepositorySecondaryPort) {
    super();
  }

  protected async handle(input: FindPaginatedClientNetworkCardsIn): Promise<FindPaginatedClientNetworkCardsOut> {
    const paginationOption: PaginationOption = {
      page: input.paginationOptions.page,
      pageSize: input.paginationOptions.pageSize,
    };

    const paginatedData = await this.clientNetworkCardQueryRepository.findPaginatedClientNetworkCards(input.clientId, paginationOption);

    return FindPaginatedClientNetworkCardsOut.create(paginatedData);
  }
}
