import { FindClientCommandCountIn } from './find-client-command-count.in';
import { FindClientCommandCountOut } from './find-client-command-count.out';

export interface FindClientCommandCountQueryPrimaryPort {
  execute(input: FindClientCommandCountIn): Promise<FindClientCommandCountOut>;
}
