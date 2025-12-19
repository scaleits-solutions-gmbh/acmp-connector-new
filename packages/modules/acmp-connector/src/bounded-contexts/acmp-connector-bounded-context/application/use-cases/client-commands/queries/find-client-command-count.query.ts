import { BaseApi } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit/common';
import { FindClientCommandCountIn } from 'acmp-connector-bounded-context/application/ports/primary/client-commands/queries/find-client-command-count/find-client-command-count.in';
import { FindClientCommandCountOut } from 'acmp-connector-bounded-context/application/ports/primary/client-commands/queries/find-client-command-count/find-client-command-count.out';
import { FindClientCommandCountQueryPrimaryPort } from 'acmp-connector-bounded-context/application/ports/primary/client-commands/queries/find-client-command-count/find-client-command-count.query.port';
import { ClientCommandQueryRepositorySecondaryPort } from 'acmp-connector-bounded-context/application/ports/secondary/repositories/client-commands/client-command.query-repository';

export class FindClientCommandCountQuery extends BaseApi<FindClientCommandCountIn, FindClientCommandCountOut> implements FindClientCommandCountQueryPrimaryPort {
  public constructor(private readonly clientCommandQueryRepository: ClientCommandQueryRepositorySecondaryPort) {
    super();
  }

  protected async handle(input: FindClientCommandCountIn): Promise<FindClientCommandCountOut> {
    const filters = input.filters ? { searchTerm: input.filters?.searchTerm } : undefined;

    const count = await this.clientCommandQueryRepository.findClientCommandCount(filters);

    return FindClientCommandCountOut.create({ count });
  }
}
