import { FindPaginatedClientCommandsIn } from './find-paginated-client-commands.in';
import { FindPaginatedClientCommandsOut } from './find-paginated-client-commands.out';
import { BaseApiPort } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit';

export interface FindPaginatedClientCommandsQueryPrimaryPort extends BaseApiPort<FindPaginatedClientCommandsIn, FindPaginatedClientCommandsOut> {}
