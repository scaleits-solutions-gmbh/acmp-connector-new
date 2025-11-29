import { FindClientHardDriveCountIn } from './find-client-hard-drive-count.in';
import { FindClientHardDriveCountOut } from './find-client-hard-drive-count.out';

export interface FindClientHardDriveCountQueryPrimaryPort {
  execute(input: FindClientHardDriveCountIn): Promise<FindClientHardDriveCountOut>;
}
