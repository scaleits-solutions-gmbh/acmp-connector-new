import { PushClientCommandCommandIn } from '@/application/ports/primary/client-commands/commands/push-client-command/push-client-command.command.in';
import { PushClientCommandCommandOut } from '@/application/ports/primary/client-commands/commands/push-client-command/push-client-command.command.out';
import { PushClientCommandCommandPrimaryPort } from '@/application/ports/primary/client-commands/commands/push-client-command/push-client-command.command.port';
import { ClientCommandWriteRepositorySecondaryPort } from '@/application/ports/secondary/repositories/client-commands/client-command.write-repository';

export class PushClientCommandCommand implements PushClientCommandCommandPrimaryPort {
  public constructor(private readonly clientCommandWriteRepository: ClientCommandWriteRepositorySecondaryPort) {}

  public async execute(input: PushClientCommandCommandIn): Promise<PushClientCommandCommandOut> {
    const result = await this.clientCommandWriteRepository.pushClientCommand(input.clientCommandId, input.clientIds);

    return PushClientCommandCommandOut.create(result);
  }
}
