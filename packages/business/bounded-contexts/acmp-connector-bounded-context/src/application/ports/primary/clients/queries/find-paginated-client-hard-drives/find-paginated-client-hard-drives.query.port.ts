import { FindPaginatedClientHardDrivesIn } from './find-paginated-client-hard-drives.in';
import { FindPaginatedClientHardDrivesOut } from './find-paginated-client-hard-drives.out';

export interface FindPaginatedClientHardDrivesQueryPrimaryPort {
  execute(input: FindPaginatedClientHardDrivesIn): Promise<FindPaginatedClientHardDrivesOut>;
}
