import { FindPaginatedClientInstalledSoftwareIn } from '@/application/ports/primary/clients/queries/find-paginated-client-installed-software/find-paginated-client-installed-software.in';
import { FindPaginatedClientInstalledSoftwareOut } from '@/application/ports/primary/clients/queries/find-paginated-client-installed-software/find-paginated-client-installed-software.out';
import { FindPaginatedClientInstalledSoftwareQueryPrimaryPort } from '@/application/ports/primary/clients/queries/find-paginated-client-installed-software/find-paginated-client-installed-software.query.port';
import { ClientInstalledSoftwareQueryRepositorySecondaryPort } from '@/application/ports/secondary/repositories/clients/client-installed-software.query-repository';
import { BaseApi, PaginationOption } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit/common';

export class FindPaginatedClientInstalledSoftwareQuery extends BaseApi<FindPaginatedClientInstalledSoftwareIn, FindPaginatedClientInstalledSoftwareOut> implements FindPaginatedClientInstalledSoftwareQueryPrimaryPort {
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
