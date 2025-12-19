import { BaseApi, PaginationOption } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit/common';
import { FindPaginatedClientCommandsIn } from 'acmp-connector-bounded-context/application/ports/primary/client-commands/queries/find-paginated-client-commands/find-paginated-client-commands.in';
import { FindPaginatedClientCommandsOut } from 'acmp-connector-bounded-context/application/ports/primary/client-commands/queries/find-paginated-client-commands/find-paginated-client-commands.out';
import { FindPaginatedClientCommandsQueryPrimaryPort } from 'acmp-connector-bounded-context/application/ports/primary/client-commands/queries/find-paginated-client-commands/find-paginated-client-commands.query.port';
import { ClientCommandQueryRepositorySecondaryPort } from 'acmp-connector-bounded-context/application/ports/secondary/repositories/client-commands/client-command.query-repository';

export class FindPaginatedClientCommandsQuery extends BaseApi<FindPaginatedClientCommandsIn, FindPaginatedClientCommandsOut> implements FindPaginatedClientCommandsQueryPrimaryPort {
  public constructor(private readonly clientCommandQueryRepository: ClientCommandQueryRepositorySecondaryPort) {
    super();
  }

  protected async handle(input: FindPaginatedClientCommandsIn): Promise<FindPaginatedClientCommandsOut> {
    const paginationOption: PaginationOption = {
      page: input.paginationOptions.page,
      pageSize: input.paginationOptions.pageSize,
    };

    const filters = input.filters ? { searchTerm: input.filters?.searchTerm } : undefined;

    const paginatedData = await this.clientCommandQueryRepository.findPaginatedClientCommands(paginationOption, filters);

    return FindPaginatedClientCommandsOut.create(paginatedData);
  }
}
