import { FindPaginatedClientInstalledSoftwareIn } from './find-paginated-client-installed-software.in';
import { FindPaginatedClientInstalledSoftwareOut } from './find-paginated-client-installed-software.out';

export interface FindPaginatedClientInstalledSoftwareQueryPrimaryPort {
  execute(input: FindPaginatedClientInstalledSoftwareIn): Promise<FindPaginatedClientInstalledSoftwareOut>;
}
