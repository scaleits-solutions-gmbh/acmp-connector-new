import { FindClientInstalledSoftwareCountIn } from './find-client-installed-software-count.in';
import { FindClientInstalledSoftwareCountOut } from './find-client-installed-software-count.out';

export interface FindClientInstalledSoftwareCountQueryPrimaryPort {
  execute(input: FindClientInstalledSoftwareCountIn): Promise<FindClientInstalledSoftwareCountOut>;
}
