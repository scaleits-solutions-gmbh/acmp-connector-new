import { BaseApi, NotFoundError } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit/common';
import { FindClientCommandByIdIn } from 'acmp-connector-bounded-context/application/ports/primary/client-commands/queries/find-client-command-by-id/find-client-command-by-id.in';
import { FindClientCommandByIdOut } from 'acmp-connector-bounded-context/application/ports/primary/client-commands/queries/find-client-command-by-id/find-client-command-by-id.out';
import { FindClientCommandByIdQueryPrimaryPort } from 'acmp-connector-bounded-context/application/ports/primary/client-commands/queries/find-client-command-by-id/find-client-command-by-id.query.port';
import { ClientCommandQueryRepositorySecondaryPort } from 'acmp-connector-bounded-context/application/ports/secondary/repositories/client-commands/client-command.query-repository';

export class FindClientCommandByIdQuery extends BaseApi<FindClientCommandByIdIn, FindClientCommandByIdOut> implements FindClientCommandByIdQueryPrimaryPort {
  public constructor(private readonly clientCommandQueryRepository: ClientCommandQueryRepositorySecondaryPort) {
    super();
  }

  protected async handle(input: FindClientCommandByIdIn): Promise<FindClientCommandByIdOut> {
    const clientCommand = await this.clientCommandQueryRepository.findClientCommandById(input.id);
    if (!clientCommand) {
      throw new NotFoundError({ message: 'ClientCommand not found' });
    }
    return FindClientCommandByIdOut.create(clientCommand);
  }
}
