import { FindClientCountIn } from './find-client-count.in';
import { FindClientCountOut } from './find-client-count.out';

export interface FindClientCountQueryPrimaryPort {
  execute(input: FindClientCountIn): Promise<FindClientCountOut>;
}
