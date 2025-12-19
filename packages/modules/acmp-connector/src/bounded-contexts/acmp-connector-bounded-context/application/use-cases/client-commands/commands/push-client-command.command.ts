import { BaseApi } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit/common';
import { PushClientCommandCommandIn } from 'acmp-connector-bounded-context/application/ports/primary/client-commands/commands/push-client-command/push-client-command.command.in';
import { PushClientCommandCommandOut } from 'acmp-connector-bounded-context/application/ports/primary/client-commands/commands/push-client-command/push-client-command.command.out';
import { PushClientCommandCommandPrimaryPort } from 'acmp-connector-bounded-context/application/ports/primary/client-commands/commands/push-client-command/push-client-command.command.port';
import { ClientCommandWriteRepositorySecondaryPort } from 'acmp-connector-bounded-context/application/ports/secondary/repositories/client-commands/client-command.write-repository';

export class PushClientCommandCommand extends BaseApi<PushClientCommandCommandIn, PushClientCommandCommandOut> implements PushClientCommandCommandPrimaryPort {
  public constructor(private readonly clientCommandWriteRepository: ClientCommandWriteRepositorySecondaryPort) {
    super();
  }

  protected async handle(input: PushClientCommandCommandIn): Promise<PushClientCommandCommandOut> {
    const result = await this.clientCommandWriteRepository.pushClientCommand(input.clientCommandId, input.clientIds);

    return PushClientCommandCommandOut.create(result);
  }
}
