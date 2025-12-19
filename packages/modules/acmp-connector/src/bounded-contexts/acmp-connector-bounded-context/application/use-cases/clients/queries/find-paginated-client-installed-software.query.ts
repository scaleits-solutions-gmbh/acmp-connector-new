import { BaseApi, PaginationOption } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit/common';
import { FindPaginatedClientInstalledSoftwareIn } from 'acmp-connector-bounded-context/application/ports/primary/clients/queries/find-paginated-client-installed-software/find-paginated-client-installed-software.in';
import { FindPaginatedClientInstalledSoftwareOut } from 'acmp-connector-bounded-context/application/ports/primary/clients/queries/find-paginated-client-installed-software/find-paginated-client-installed-software.out';
import { FindPaginatedClientInstalledSoftwareQueryPrimaryPort } from 'acmp-connector-bounded-context/application/ports/primary/clients/queries/find-paginated-client-installed-software/find-paginated-client-installed-software.query.port';
import { ClientInstalledSoftwareQueryRepositorySecondaryPort } from 'acmp-connector-bounded-context/application/ports/secondary/repositories/clients/client-installed-software.query-repository';

export class FindPaginatedClientInstalledSoftwareQuery
  extends BaseApi<FindPaginatedClientInstalledSoftwareIn, FindPaginatedClientInstalledSoftwareOut>
  implements FindPaginatedClientInstalledSoftwareQueryPrimaryPort
{
  public constructor(private readonly clientInstalledSoftwareQueryRepository: ClientInstalledSoftwareQueryRepositorySecondaryPort) {
    super();
  }

  protected async handle(input: FindPaginatedClientInstalledSoftwareIn): Promise<FindPaginatedClientInstalledSoftwareOut> {
    const paginationOption: PaginationOption = {
      page: input.paginationOptions.page,
      pageSize: input.paginationOptions.pageSize,
    };

    const filters = input.filters ? { searchTerm: input.filters?.searchTerm } : undefined;

    const paginatedData = await this.clientInstalledSoftwareQueryRepository.findPaginatedClientInstalledSoftware(input.clientId, paginationOption, filters);

    return FindPaginatedClientInstalledSoftwareOut.create(paginatedData);
  }
}
