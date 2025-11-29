import { FindPaginatedClientCommandsIn } from './find-paginated-client-commands.in';
import { FindPaginatedClientCommandsOut } from './find-paginated-client-commands.out';

export interface FindPaginatedClientCommandsQueryPrimaryPort {
  execute(input: FindPaginatedClientCommandsIn): Promise<FindPaginatedClientCommandsOut>;
}
