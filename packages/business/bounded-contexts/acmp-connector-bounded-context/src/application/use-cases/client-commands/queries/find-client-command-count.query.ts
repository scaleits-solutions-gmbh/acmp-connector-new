import { FindClientCommandCountIn } from '@/application/ports/primary/client-commands/queries/find-client-command-count/find-client-command-count.in';
import { FindClientCommandCountOut } from '@/application/ports/primary/client-commands/queries/find-client-command-count/find-client-command-count.out';
import { FindClientCommandCountQueryPrimaryPort } from '@/application/ports/primary/client-commands/queries/find-client-command-count/find-client-command-count.query.port';
import { ClientCommandQueryRepositorySecondaryPort } from '@/application/ports/secondary/repositories/client-commands/client-command.query-repository';

export class FindClientCommandCountQuery implements FindClientCommandCountQueryPrimaryPort {
  public constructor(private readonly clientCommandQueryRepository: ClientCommandQueryRepositorySecondaryPort) {}

  public async execute(input: FindClientCommandCountIn): Promise<FindClientCommandCountOut> {
    const filters = input.filters ? { searchTerm: input.filters?.searchTerm } : undefined;

    const count = await this.clientCommandQueryRepository.findClientCommandCount(filters);

    return FindClientCommandCountOut.create({ count });
  }
}
