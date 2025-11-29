import { FindPaginatedClientsIn } from '@/application/ports/primary/clients/queries/find-paginated-clients/find-paginated-clients.in';
import { FindPaginatedClientsOut } from '@/application/ports/primary/clients/queries/find-paginated-clients/find-paginated-clients.out';
import { FindPaginatedClientsQueryPrimaryPort } from '@/application/ports/primary/clients/queries/find-paginated-clients/find-paginated-clients.query.port';
import { ClientQueryRepositorySecondaryPort } from '@/application/ports/secondary/repositories/clients/client.query-repository';
import { PaginationOption } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit';

export class FindPaginatedClientsQuery implements FindPaginatedClientsQueryPrimaryPort {
  public constructor(private readonly clientQueryRepository: ClientQueryRepositorySecondaryPort) {}

  public async execute(input: FindPaginatedClientsIn): Promise<FindPaginatedClientsOut> {
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
