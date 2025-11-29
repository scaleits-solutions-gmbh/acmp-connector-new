import { FindPaginatedClientHardDrivesIn } from '@/application/ports/primary/clients/queries/find-paginated-client-hard-drives/find-paginated-client-hard-drives.in';
import { FindPaginatedClientHardDrivesOut } from '@/application/ports/primary/clients/queries/find-paginated-client-hard-drives/find-paginated-client-hard-drives.out';
import { FindPaginatedClientHardDrivesQueryPrimaryPort } from '@/application/ports/primary/clients/queries/find-paginated-client-hard-drives/find-paginated-client-hard-drives.query.port';
import { ClientHardDriveQueryRepositorySecondaryPort } from '@/application/ports/secondary/repositories/clients/client-hard-drive.query-repository';
import { PaginationOption } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit';

export class FindPaginatedClientHardDrivesQuery implements FindPaginatedClientHardDrivesQueryPrimaryPort {
  public constructor(private readonly clientHardDriveQueryRepository: ClientHardDriveQueryRepositorySecondaryPort) {}

  public async execute(input: FindPaginatedClientHardDrivesIn): Promise<FindPaginatedClientHardDrivesOut> {
    const paginationOption: PaginationOption = {
      page: input.paginationOptions.page,
      pageSize: input.paginationOptions.pageSize,
    };

    const paginatedData = await this.clientHardDriveQueryRepository.findPaginatedClientHardDrives(input.clientId, paginationOption);

    return FindPaginatedClientHardDrivesOut.create(paginatedData);
  }
}
