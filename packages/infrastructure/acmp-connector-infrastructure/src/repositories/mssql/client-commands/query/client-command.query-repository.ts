import {
  MssqlUtils
} from '@/infra/mssql/client';
import {
  ClientCommandQueryRepositorySecondaryPort,
  FindPaginatedClientCommandsFilters,
} from '@repo/business/bounded-contexts/acmp-connector-bounded-context';
import { PaginationOption } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit';
import { PaginatedData, paginateExternalData } from '@scaleits-solutions-gmbh/org-lib-global-common-kit';
import { AcmpClientCommandReadModel } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';

import { findPaginatedClientCommandsQueryMethod } from './query-methods/find-paginated-client-commands.query-method';
import { findClientCommandByIdQueryMethod } from './query-methods/find-client-command-by-id.query-method';
import { findClientCommandCountQueryMethod } from './query-methods/find-client-command-count.query-method';
import { BaseSpi } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit/common';
export class MssqlClientCommandQueryRepository extends BaseSpi implements ClientCommandQueryRepositorySecondaryPort {
  public constructor() {
    super();
  }
  /**
   * Find paginated list of client commands
   */
  async findPaginatedClientCommands(
    pagination: PaginationOption,
    filters?: FindPaginatedClientCommandsFilters,
  ): Promise<PaginatedData<AcmpClientCommandReadModel>> {
    const data = await findPaginatedClientCommandsQueryMethod(pagination, filters);
    return data;
  }

  /**
   * Find client command by ID
   */
  async findClientCommandById(id: string): Promise<AcmpClientCommandReadModel | null> {
    const command = await findClientCommandByIdQueryMethod(id);
    return command;
  }

  /**
   * Count client commands with optional filters
   */
  async findClientCommandCount(filters?: FindPaginatedClientCommandsFilters): Promise<number> {
    const count = await findClientCommandCountQueryMethod(filters);
    return count;
  }
}

