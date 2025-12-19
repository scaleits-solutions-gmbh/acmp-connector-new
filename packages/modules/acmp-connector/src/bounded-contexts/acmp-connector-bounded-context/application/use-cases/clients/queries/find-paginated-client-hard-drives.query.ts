import { BaseApi, PaginationOption } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit/common';
import { FindPaginatedClientHardDrivesIn } from 'acmp-connector-bounded-context/application/ports/primary/clients/queries/find-paginated-client-hard-drives/find-paginated-client-hard-drives.in';
import { FindPaginatedClientHardDrivesOut } from 'acmp-connector-bounded-context/application/ports/primary/clients/queries/find-paginated-client-hard-drives/find-paginated-client-hard-drives.out';
import { FindPaginatedClientHardDrivesQueryPrimaryPort } from 'acmp-connector-bounded-context/application/ports/primary/clients/queries/find-paginated-client-hard-drives/find-paginated-client-hard-drives.query.port';
import { ClientHardDriveQueryRepositorySecondaryPort } from 'acmp-connector-bounded-context/application/ports/secondary/repositories/clients/client-hard-drive.query-repository';

export class FindPaginatedClientHardDrivesQuery extends BaseApi<FindPaginatedClientHardDrivesIn, FindPaginatedClientHardDrivesOut> implements FindPaginatedClientHardDrivesQueryPrimaryPort {
  public constructor(private readonly clientHardDriveQueryRepository: ClientHardDriveQueryRepositorySecondaryPort) {
    super();
  }

  protected async handle(input: FindPaginatedClientHardDrivesIn): Promise<FindPaginatedClientHardDrivesOut> {
    const paginationOption: PaginationOption = {
      page: input.paginationOptions.page,
      pageSize: input.paginationOptions.pageSize,
    };

    const paginatedData = await this.clientHardDriveQueryRepository.findPaginatedClientHardDrives(input.clientId, paginationOption);

    return FindPaginatedClientHardDrivesOut.create(paginatedData);
  }
}
