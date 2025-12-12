import { BaseApi, PaginationOption } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit/common';
import { FindPaginatedClientsIn } from '@/application/ports/primary/clients/queries/find-paginated-clients/find-paginated-clients.in';
import { FindPaginatedClientsOut } from '@/application/ports/primary/clients/queries/find-paginated-clients/find-paginated-clients.out';
import { FindPaginatedClientsQueryPrimaryPort } from '@/application/ports/primary/clients/queries/find-paginated-clients/find-paginated-clients.query.port';
import { ClientQueryRepositorySecondaryPort } from '@/application/ports/secondary/repositories/clients/client.query-repository';

export class FindPaginatedClientsQuery extends BaseApi<FindPaginatedClientsIn, FindPaginatedClientsOut> implements FindPaginatedClientsQueryPrimaryPort {
  public constructor(private readonly clientQueryRepository: ClientQueryRepositorySecondaryPort) {
    super();
  }

  protected async handle(input: FindPaginatedClientsIn): Promise<FindPaginatedClientsOut> {
    const paginationOption: PaginationOption = {
      page: input.paginationOptions.page,
      pageSize: input.paginationOptions.pageSize,
    };

    const filters = input.filters
      ? {
          searchTerm: input.filters?.searchTerm,
          tenantId: input.filters?.tenantId,
        }
      : undefined;

    const paginatedData = await this.clientQueryRepository.findPaginatedClients(paginationOption, filters);

    return FindPaginatedClientsOut.create(paginatedData);
  }
}
