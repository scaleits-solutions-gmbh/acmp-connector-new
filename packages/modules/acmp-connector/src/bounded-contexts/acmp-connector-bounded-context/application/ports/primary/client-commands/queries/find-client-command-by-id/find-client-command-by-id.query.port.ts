import { FindClientCommandByIdIn } from './find-client-command-by-id.in';
import { FindClientCommandByIdOut } from './find-client-command-by-id.out';

export interface FindClientCommandByIdQueryPrimaryPort {
  execute(input: FindClientCommandByIdIn): Promise<FindClientCommandByIdOut>;
}
